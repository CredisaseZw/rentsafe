import json
from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from marshmallow import ValidationError

from rentsafe.models import (
    Claim,
    ClaimDebtorType,
    CommunicationHistoryReminder,
    Company,
    Individual,
)
from rentsafe.serializers import CreateClaimSchema


@login_required
@require_http_methods(["POST"])
def create_claim(request):
    user_id = request.user.id
    # validate data
    try:
        schema = CreateClaimSchema()
        data = schema.loads(request.body)
    except ValidationError as e:
        props = {"errors": e.messages}

        return JsonResponse(props, status=400, safe=False)

    # get data from request
    data = json.loads(request.body.decode("utf-8"))

    # create claim
    new_claim = Claim(
        creditor_id=user_id,
        data_source=data.get("data_source"),
        debtor_id=data.get("debtor_id"),
        is_individual=ClaimDebtorType.INDIVIDUAL == data.get("debtor_type"),
        is_company=ClaimDebtorType.COMPANY == data.get("debtor_type"),
        account_number=data.get("account_number"),
        currency=data.get("currency"),
        amount=data.get("amount"),
        date=data.get("date"),
    )

    new_claim.save()

    # get debtor type
    debtor_type = None

    if new_claim.is_individual:
        debtor_type = ClaimDebtorType.INDIVIDUAL
        
    elif new_claim.is_company:
        debtor_type = ClaimDebtorType.COMPANY

    # return response
    return JsonResponse(
        {
            "id": new_claim.id,
            "creditor_id": new_claim.creditor_id,
            "data_source": new_claim.data_source,
            "debtor_id": new_claim.debtor_id,
            "debtor_type": debtor_type,
            "account_number": new_claim.account_number,
            "currency": new_claim.currency,
            "amount": new_claim.amount,
            "date": new_claim.date,
            "created_at": new_claim.created_at,
            "updated_at": new_claim.updated_at,
        },
        status=201,
        safe=False,
    )


def get_individuals_by_name(name: str, limit: int = 10):
    # split name
    name_parts = name.split(" ")

    # get firstname and surname
    firstname = name_parts[0] if len(name_parts) > 0 else ""
    surname = name_parts[1] if len(name_parts) > 1 else firstname

    # get individuals
    individuals = Individual.objects.filter(
        Q(firstname__icontains=firstname) | Q(surname__icontains=surname)
        | Q(identification_number__icontains=name)
        |Q (mobile__icontains=name)
    )[:limit]

    return individuals


def get_companies_by_name(name: str, limit: int = 10):
    # get companies
    companies = Company.objects.filter(
        Q(registration_name__icontains=name) | Q(trading_name__icontains=name)
        | Q(registration_number__icontains=name)
    )[:limit]

    return companies


@require_http_methods(["GET"])
def search_individuals_or_companies(request):
    # get query and entity type
    query = request.GET.get("q", "")
    entity_type = request.GET.get("type", "")
    limit = request.GET.get("limit", 10)

    # check if query is provided
    if not query:
        return JsonResponse(
            {"errors": {"q": ["This field is required."]}}, status=400, safe=False
        )

    # set limit
    try:
        limit = int(limit)
    except ValueError:
        limit = 10

    # response
    response_dict = {
        "data": [],
    }

    # search individuals
    if entity_type.upper() == ClaimDebtorType.INDIVIDUAL:
        individuals = get_individuals_by_name(query, limit)

        for individual in individuals:
            response_dict["data"].append(
                {
                    "id": individual.id,
                    "national_id": individual.national_id,
                    "firstname": individual.firstname,
                    "surname": individual.surname,
                    "type": ClaimDebtorType.INDIVIDUAL,
                }
            )

        return JsonResponse(response_dict, status=200, safe=False)
    # search companies
    elif entity_type.upper() == ClaimDebtorType.COMPANY:
        
        companies = get_companies_by_name(query, limit)

        for company in companies:
            response_dict["data"].append(
                {
                    "id": company.id,
                    "registration_number": company.registration_number if company.registration_number else "",
                    "registration_name": company.registration_name,
                    "type": ClaimDebtorType.COMPANY,
                }
            )

        return JsonResponse(response_dict, status=200, safe=False)

    # search both
    else:
        individuals = get_individuals_by_name(query, limit)
        companies = get_companies_by_name(query, limit)

        for individual in individuals:
            response_dict["data"].append(
                {
                    "national_id": individual.national_id,
                    "firstname": individual.firstname,
                    "surname": individual.surname,
                    "type": ClaimDebtorType.INDIVIDUAL,
                }
            )

        for company in companies:
            response_dict["data"].append(
                {
                    "registration_number": company.registration_number,
                    "registration_name": company.registration_name,
                    "type": ClaimDebtorType.COMPANY,
                }
            )

        # limit number of results
        response_dict["data"] = response_dict["data"][:limit]

        return JsonResponse(response_dict, status=200, safe=False)
