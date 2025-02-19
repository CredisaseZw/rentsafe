from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.conf import settings
import os
import requests
import contextlib
from rentsafe.rent_views.company import generate_otp
import re
from django.core.paginator import Paginator
from rentsafe.helper import *
from django.db.models import Q
from django.apps import apps
from django.views import View
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from django.core.files.storage import FileSystemStorage
from .models import ChatUserSession
from django.utils import timezone
from authentication.models import *
from rentsafe.models import *
from . import app_settings
import calendar
from datetime import datetime
from dateutil.relativedelta import relativedelta
from rentsafe.rent_views.clients import clients_credit_dashboard, active_credit_accounts, check_credit_score, historic_claims
                    

@method_decorator(csrf_exempt, name="dispatch")
class WhatsAppWebhook(View):
    def __init__(self, **kwargs):
        """
        Constructor for the class, initializes any additional attributes or performs setup.

        Parameters:
            **kwargs: additional keyword arguments

        Returns:
            None
        """
        super().__init__(**kwargs)
        # Initialize any additional attributes or perform setup here
        with open(
            os.path.join(settings.BASE_DIR, "bot", "chatbot_response.json"), "r"
        ) as file:
            self.menu_text = json.load(file)

    def sendWhatsAppMessage(self,phoneNumber, message):
        headers = {
            "Authorization": "Bearer " + settings.WHATSAPP_ACCESS_TOKEN
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "text",
            "text": {
                "body": message
            }
        }

        response = requests.post(
            settings.WHATSAPP_API_URL,
            headers=headers,
            json=payload
        )
        # print(settings.WHATSAPP_ACCESS_TOKEN)
        answer = response.json()
        print("answer", answer)
        return answer
    
    def chat_proceed(self, message,phoneNumber, user):
        """
        chat_proceed: A method to process a chat message and return a Twilio-friendly HTTP response.

        Parameters:
            self: the instance of the class
            message: the chat message to be processed

        Returns:
            HttpResponse: a Twilio-friendly HTTP response
        """
        print("chat proceed is sending response")
        self.sendWhatsAppMessage(phoneNumber, message)
        return HttpResponse('success', status=200)
    
    def chat_end(self, message,phoneNumber, user):
        """
        chat_proceed: A method to process a chat message and return a Twilio-friendly HTTP response.

        Parameters:
            self: the instance of the class
            message: the chat message to be processed

        Returns:
            HttpResponse: a Twilio-friendly HTTP response
        """
        self.sendWhatsAppMessage(phoneNumber, message)
        return HttpResponse('success', status=200)
    
    def is_user_type_admin(self, phone_number):
        # print("================phone_number", phone_number)
        if phone_number == "+263775686900": #Admin
            return True
        else:
            return False
        # try:

        #     user = CustomUser.objects.get(username=phone_number)
        #     return user.user_type == 2
        # except CustomUser.DoesNotExist:
        #     print("phone_number---------------err")
        #     return False
        
    def has_session_expired(self, waId):
        """
        Check if the session has expired for the given waId.

        :param waId: the unique identifier for the session
        :type waId: intIndividual
        :return: True if the session has expired, False otherwise
        :rtype: bool
        """
        chat_session = ChatUserSession.objects.filter(mobile=waId).first()
        if chat_session:
            return (
                timezone.now() - timedelta(minutes=20) >= chat_session.expiration_time
            )
        else:
            return False
        
    def delete_session(self, phoneNumber):
        """
        Deletes a chat session for a given WhatsApp ID.

        Parameters:Individual
            self: the object instance
            waId: the WhatsApp ID for which the chat session needs to be deleted

        Returns:
            None
        """
        chat_session = ChatUserSession.objects.filter(mobile=phoneNumber).first()
        if chat_session:
            chat_session.delete()
    
    def update_main_state(self, phoneNumber, state):
        """
        Update the state of the main object in the ChatSession based on the given WhatsApp ID and state.

        :param waId: The WhatsApp ID for which the state needs to be updated
        :param state: The new state to be assigned to the ChatSession object
        :return: None
        """
        try:
            obj = ChatUserSession.objects.get(mobile=phoneNumber)
            obj.state = state
            obj.save()
        except ChatUserSession.DoesNotExist:
            pass

    def create_chat_session(self, phoneNumber, state, user_id=0, company_id=0):
        """
        Create a chat session with the given WhatsApp ID and state.

        Args:
            waId: The WhatsApp ID for the chat session.
            state: The state of the chat session.

        Returns:
            None
        """
        print("create chat session")
        ChatUserSession.objects.create(
            mobile=phoneNumber, 
            state=state, 
            expiration_time=timezone.now(), 
            user_id = user_id,
            company_id = company_id
        )

    def check_individual_by_national_passport(self, incoming_message, phoneNumber, request, chat_session):
        try:
            ind =  Individual.objects.filter(identification_number=incoming_message).first()
        except Individual.DoesNotExist:
            ind = Individual.objects.none


        if ind:
            mssg = f"ID Number found; {ind.identification_number} - {ind.firstname} {ind.surname}\n1. Request check access\n2. Back to Individual check\n3. Exit"
            self.update_main_state(phoneNumber, app_settings.GET_CHECK_OR_NOT)
            return self.chat_proceed(mssg, phoneNumber, user=None) 
        else:
            chat_session.national_id = incoming_message
            chat_session.save()
            mssg = f"Sorry, that ID number was not found in our database. Would you like to add it?\n1. Yes\n2. No"
            #save national id
            self.update_main_state(phoneNumber, app_settings.INDIVIDUAL_NOT_FOUND)

            return self.chat_proceed(mssg, phoneNumber, user=None) 
        

    def show_admin_dashboard(self, profileName, incoming_message, chat_session, phoneNumber, request, media_url):
        match chat_session.state:
            case app_settings.GET_ADMIN_DASHBOARD:
                match incoming_message:
                    case "1":
                        self.update_main_state(phoneNumber, app_settings.GET_PAYMENT_STATUS_CHECK)
                        return self.chat_proceed("Payment Status Check\n\n1. Individual\n2. Company", phoneNumber, user=None)
                    case "2":
                        # self.update_main_state(phoneNumber, app_settings.GET_USER_MANAGEMENT)
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("User Management", phoneNumber, user=None)
                    case "3":
                        # self.update_main_state(phoneNumber, app_settings.GET_SUBSCRIPTION)
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("Subscription", phoneNumber, user=None)
                  
                    case "0":
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("You have been cancelled the process", phoneNumber, user=None)
                    case _:
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.GET_PAYMENT_STATUS_CHECK:
                if incoming_message == '1':
                    self.update_main_state(phoneNumber, app_settings.CHECK_INDIVIDUAL_BY)
                    return self.chat_proceed("Individual check by;\n1. ID Number\n2. Passport Number", phoneNumber, user=None)
                elif incoming_message == '2':
                    self.update_main_state(phoneNumber, app_settings.CHECK_COMPANY)
                    return self.chat_proceed("Please enter registration name or trading name here", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.CHECK_COMPANY:
                self.delete_session(phoneNumber)
                return self.show_company_payment_report(incoming_message, phoneNumber, request)
                # return self.chat_proceed("Apologies, but the function is currently in development.", phoneNumber, user=None)
            case app_settings.CHECK_INDIVIDUAL_BY:
                if incoming_message == '1' or  incoming_message == '2':
                    self.update_main_state(phoneNumber, app_settings.CHECK_INDIVIDUAL_BY_NATIONAL_OR_PASSPORT)
                    return self.chat_proceed("Please enter ID Number here like 12345678A90", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.CHECK_INDIVIDUAL_BY_NATIONAL_OR_PASSPORT:
                return self.check_individual_by_national_passport(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CHECK_OR_NOT:
                return self.get_check_or_not(incoming_message, phoneNumber, request)
            case app_settings.SHOW_PAYMENT_REPORT:
                return self.show_payment_report(incoming_message, phoneNumber, request)
            case app_settings.INDIVIDUAL_NOT_FOUND:
                if incoming_message == '1':
                    self.update_main_state(phoneNumber, app_settings.GET_SURNAME)
                    return self.chat_proceed("Please add surname here", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_end(self.menu_text.get("goodbye"), phoneNumber, user=None)
            case app_settings.GET_SURNAME:
                return self.get_surname(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_FIRST_NAME:
                return self.get_first_name(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_ADDRESS:
                return self.get_address(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_PHONE:
                return self.get_phone(incoming_message, phoneNumber, request, chat_session)
            case app_settings.ABOUT_TO_CONFIRM:
                return self.about_to_confirm(incoming_message, phoneNumber, request, chat_session)
            case _:
                self.create_chat_session(phoneNumber, app_settings.GET_ADMIN_DASHBOARD)
                menu_text = f"Hello {profileName}! \nWelcome to RentSafe.Please pick an option;\n\n1. Payment Status Check\n2. User Management\n3. Subscription"

                return self.chat_proceed(menu_text, phoneNumber, user=None)
    def about_to_confirm(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            try:
                Individual.objects.create(
                    national_id = chat_session.national_id,
                    firstname = chat_session.first_name,
                    surname = chat_session.surname,
                    mobile = chat_session.phone,
                    address = chat_session.address,
                    identification_number = chat_session.national_id
                )
            except:
                pass
            self.delete_session(phoneNumber)
            return self.chat_proceed('The user has successfully recorded.', phoneNumber, user=None)
        elif incoming_message == '2':
            self.delete_session(phoneNumber)
            return self.chat_end("Apologies, but the function is currently in development.", phoneNumber, user=None)
        elif incoming_message == '3':
            self.update_main_state(phoneNumber, app_settings.GET_ADMIN_DASHBOARD)
            menu_text = f"Please pick an option;\n\n1. Payment Status Check\n2. User Management\n3. Subscription"
            return self.chat_proceed(menu_text, phoneNumber, user=None)
        else:
            #real
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
    
    def get_phone(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.phone = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.ABOUT_TO_CONFIRM)
        mssg = f"You have added the individual;\n {chat_session.first_name} {chat_session.surname} \nID Number: {chat_session.national_id} \nAddress : {chat_session.address} \nMobile Number : {incoming_message}\n\n1. Confirm\n2. Edit details\n3. Return to main menu\n4. Exit"
        return self.chat_proceed(mssg, phoneNumber, user=None)
    
    def get_address(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.address = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_PHONE)
        return self.chat_proceed("Please add mobile number in the format; 0772222222", phoneNumber, user=None)
    
    def get_surname(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.surname = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_FIRST_NAME)
        return self.chat_proceed("Please add first name here", phoneNumber, user=None)
    
    def get_first_name(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.first_name = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_ADDRESS)
        return self.chat_proceed("Please add here residential address in the format; 2 Grade Close, Mukumba, Marondera, Zimbabwe", phoneNumber, user=None)

    def show_payment_report(self, incoming_message, phoneNumber, request):
        # try:
        #     ind =  Individual.objects.filter(identification_number=incoming_message).first()
        # except Individual.DoesNotExist:
        #     ind = Individual.objects.none
        self.delete_session(phoneNumber)
        mssg = f"Payment Status Report\n12345678A90 - John Dora\nListed Address - 1A Mugamba Crescent; Warren Park, Harare, Zimbabwe\nStatus - Low Risk (flag)\nActive Leases - 0\nIn Arrears - 0\n\n1. Detailed status\n2. Create Subscription\n3. Exit "
        return self.chat_proceed(mssg, phoneNumber, user=None)
    
    def show_company_payment_report(self, incoming_message, phoneNumber, request):
        # try:
        #     ind =  Individual.objects.filter(identification_number=incoming_message).first()
        # except Individual.DoesNotExist:
        #     ind = Individual.objects.none
        self.delete_session(phoneNumber)
        mssg = f"Payment Status Report\n12345678A90 - Fincheck\nListed Address - 1A Mugamba Crescent; Warren Park, Harare, Zimbabwe\nStatus - Low Risk (flag)\nActive Leases - 0\nIn Arrears - 0\n\n1. Detailed status\n2. Create Subscription\n3. Exit "
        return self.chat_proceed(mssg, phoneNumber, user=None)

        
            
    def get_check_or_not(self, incoming_message, phoneNumber, request):
        if incoming_message == '1':
            msg = "Please enter here checking access code supplied"
            # send SMS  -access token
            self.update_main_state(phoneNumber, app_settings.SHOW_PAYMENT_REPORT)
            return self.chat_proceed(msg, phoneNumber, user=None)
        elif incoming_message == '2':
            self.update_main_state(phoneNumber, app_settings.CHECK_INDIVIDUAL_BY)
            return self.chat_proceed("Individual check by;\n1. ID Number\n2. Passport Number", phoneNumber, user=None)
        elif incoming_message == '3':
            self.delete_session(phoneNumber)
            return self.chat_end(self.menu_text.get("session_end"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)

    def process_level_one_welcome_admin(
        self, chat_session, incoming_message, phoneNumber, profileName, request, media_url
    ):
        """
        Process the level one welcome message for a given client, chat session, incoming message, WhatsApp ID, and sender name.
        """
        if self.has_session_expired(phoneNumber):
            # session expired
            # DONE delete session
            self.delete_session(phoneNumber)
            return self.chat_end(self.menu_text.get("session_end"), phoneNumber, user=None)
        else:
            
            if chat_session:
                return self.show_admin_dashboard(
                    profileName, incoming_message, chat_session, phoneNumber, request, media_url
                )
            else:
                self.create_chat_session(phoneNumber, app_settings.GET_ADMIN_DASHBOARD)
                menu_text = f"Hello {profileName}! \nWelcome to RentSafe.Please pick an option;\n\n1. Payment Status Check\n2. User Management\n3. Subscription"
                return self.chat_proceed(menu_text, phoneNumber, user=None)

    
    def process_level_one_welcome_client(
        self, chat_session, incoming_message, phoneNumber, profileName, request, media_url
    ):
        """
        Process the level one welcome message for a given client, chat session, incoming message, WhatsApp ID, and sender name.
        """
        if self.has_session_expired(phoneNumber):
            # session expired
            # DONE delete session
            self.delete_session(phoneNumber)
            return self.chat_end(self.menu_text.get("session_end"), phoneNumber, user=None)
        else:
            
            if chat_session:
                return self.show_client_dashboard(
                    profileName, incoming_message, chat_session, phoneNumber, request, media_url
                )
            else:
                #Get Client User Data

                request_user = CustomUser.objects.filter(user_id=phoneNumber).first()
                user_id = 0
                company_id = 0
                amount_owing_taken = 0
                amount_owing_given = 0
                score_level = ''

                if request_user:
                    user_id = request_user.id
                    company_id = request_user.company
                    data = clients_credit_dashboard(company_id)

                    try:
                        amount_owing_taken = data["client_credits_taken"][0]["amount_owing"]
                        amount_owing_given = data["client_credits_given"][0]["amount_owing"]
                        score_level = data["worst_credit_status"]["score_level"]
                    except:
                        pass

                if score_level == "HHR":
                    risk_level = "High High Risk"
                    emoji = '🟥'

                elif score_level == "LHR":
                    risk_level = "Low High Risk"
                    emoji = '🟧'

                elif score_level == "HLR":
                    risk_level = "High Low Risk"
                    emoji = '🟪'

                elif score_level == "NP":
                    risk_level = "Non Payer"
                    emoji = '⬛'

                else:
                    risk_level = "Low Low Risk"
                    emoji = '🟩'

                self.create_chat_session(phoneNumber, app_settings.GET_CLIENT_DASHBOARD, user_id, company_id)
                menu_text = f"Welcome {profileName}!\n\nYour Payment Status: \n*{risk_level}*{emoji}\n\n*Net Status*\nCredit Taken: US${amount_owing_taken}\nCredit Given: US${amount_owing_given}\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"
                return self.chat_proceed(menu_text, phoneNumber, user=None)
    
    def show_client_dashboard(self, profileName, incoming_message, chat_session, phoneNumber, request, media_url):
        match chat_session.state:
            case app_settings.GET_CLIENT_DASHBOARD:
                match incoming_message:
                    case "1":
                        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_PAYMENT_STATUS_CHECK)
                        return self.chat_proceed("Payment Status Check\n\n1. Individual\n2. Company", phoneNumber, user=None)
                    case "2":
                        self.update_main_state(phoneNumber, app_settings.GET_SELECT_SERVICE)
                        return self.chat_proceed("Services\n1. RentSafe\n2. Exit", phoneNumber, user=None)
                    case "3":
                        # self.update_main_state(phoneNumber, app_settings.GET_SUBSCRIPTION)
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("Accounting", phoneNumber, user=None)
                    case "4":
                        # self.update_main_state(phoneNumber, app_settings.GET_SUBSCRIPTION)
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("Subscriptions", phoneNumber, user=None)
                  
                    case "5":
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("You have been cancelled the process", phoneNumber, user=None)
                    case _:
                        self.delete_session(phoneNumber)
                        return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
                    
            case app_settings.GET_SELECT_SERVICE:
                if incoming_message == '1':
                    self.update_main_state(phoneNumber, app_settings.GET_RENTSAFE_OPTIONS)
                    return self.chat_proceed("RentSafe\n1. Active Lease\n2. New lease\n3. Exit", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_end(self.menu_text.get("goodbye"), phoneNumber, user=None)
            
            case app_settings.GET_RENTSAFE_OPTIONS:
                return self.get_rentsafe_options(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.NEW_LEASE_TYPE:
                return self.new_lease_type(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_LEASE_INDIVIDUAL_NATIONALID:
                return self.get_lease_individual_nationalid(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_IS_INDIVIDUALID_VISUALLY_VERIFIED:
                return self.get_is_individualid_visually_verified(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_ADDRESS:
                return self.get_individual_lease_address(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_INDIVIDUAL_LEASE_DETAIL:
                return self.get_individual_lease_detail(incoming_message, phoneNumber, request, chat_session)

            case app_settings.GET_INDIVIDUAL_LEASE_START_DATE:
                return self.get_individual_lease_start_date(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_INDIVIDUAL_LEASE_END_DATE:
                return self.get_individual_lease_end_date(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_INDIVIDUAL_LEASE_CURRENCY:
                return self.get_individual_lease_currency(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_INDIVIDUAL_LEASE_IS_VARIABLE:
                return self.get_individual_lease_is_variable(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_INDIVIDUAL_LEASE_DEPOSIT:
                return self.get_individual_lease_deposit(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_PAYMENT_GRACE_PERIOD:
                return self.get_individual_lease_payment_period(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_CURRENT_RENT_BALANCE:
                return self.get_individual_lease_current_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_LAST_MONTH_RENT_BALANCE:
                return self.get_individual_lease_last_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_TWO_MONTH_RENT_BALANCE:
                return self.get_individual_lease_two_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_THREE_MONTH_RENT_BALANCE:
                return self.get_individual_lease_three_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_FOUR_MONTH_RENT_BALANCE:
                return self.get_individual_lease_four_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_LEASE_MONTHLY_RENTAL_AMOUNT:
                return self.get_individual_lease_monthly_rental_amount(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_CONFIRM_LEASE_DETAIL:
                return self.get_individual_confirm_lease_detail(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_INDIVIDUAL_CONFIMATION_OTP:
                return self.get_individual_confirmation_otp(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_LEASE_COMPANY_OPTION:
                return self.get_lease_company_option(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_NEW_COMPANY_LEASE_SEARCH_VALUE:
                return self.get_new_company_lease_search_value(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_VERIFIED_COMPANY_REGISTRATION:
                return self.get_verified_company_registration(incoming_message, phoneNumber, request, chat_session)

            case app_settings.GET_COMPANY_LEASE_ADDRESS:
                return self.get_company_lease_address(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_DETAIL:
                return self.get_company_lease_detail(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_COMPANY_GUARANTOR_ID:
                return self.get_company_lease_guarantor_id(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_COMPANY_LEASE_START_DATE:
                return self.get_company_lease_start_date(incoming_message, phoneNumber, request, chat_session)

            case app_settings.GET_COMPANY_LEASE_END_DATE:
                return self.get_company_lease_end_date(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_CURRENCY:
                return self.get_company_lease_currency(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_MONTHLY_RENTAL_AMOUNT:
                return self.get_company_lease_monthly_rental_amount(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_IS_VARIABLE:
                return self.get_company_lease_is_variable(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_DEPOSIT:
                return self.get_company_lease_deposit(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_PAYMENT_GRACE_PERIOD:
                return self.get_company_lease_payment_grace_period(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_CURRENT_RENT_BALANCE:
                return self.get_company_lease_current_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_LAST_MONTH_RENT_BALANCE:
                return self.get_company_lease_last_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_TWO_MONTH_RENT_BALANCE:
                return self.get_company_lease_two_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_COMPANY_LEASE_THREE_MONTH_RENT_BALANCE:
                return self.get_company_lease_three_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_CONFIRM_LEASE_DETAIL:
                return self.get_company_confirm_lease_detail(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_CONFIMATION_OTP:
                return self.get_company_confirm_otp(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_COMPANY_LEASE_FOUR_MONTH_RENT_BALANCE:
                return self.get_company_lease_four_month_rent_balance(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.ACTIVE_LEASE_MENU:
                return self.active_lease_menu(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_PAYMENT_STATUS_CHECK:
                if incoming_message == '1':
                    self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_INDIVIDUAL_BY)
                    return self.chat_proceed("Individual check by;\n1. ID Number\n2. Passport Number", phoneNumber, user=None)
                elif incoming_message == '2':
                    self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_COMPANY)
                    return self.chat_proceed("Company check by;\n1. Name\n2. Registration Number", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.CHECK_CLIENT_COMPANY:
                if incoming_message == '1':
                    #update search type
                    chat_session.search_type = app_settings.SEARCH_TYPE_COMPANY_NAME
                    chat_session.save()
                    self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_COMPANY_BY_NAME)
                    return self.chat_proceed("Please enter Company Name here", phoneNumber, user=None)
                elif incoming_message == '2':
                    #update search type
                    chat_session.search_type = app_settings.SEARCH_TYPE_COMPANY_REG_NUM
                    chat_session.save()
                    self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_COMPANY_BY_REG_NUMBER)
                    return self.chat_proceed("Please enter Company Registration Number here", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.CHECK_CLIENT_COMPANY_BY_NAME:
                return self.check_client_company_name(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CHECK_CLIENT_COMPANY_BY_REG_NUMBER:
                return self.check_client_company_reg(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CHECK_CLIENT_INDIVIDUAL_BY:
                if incoming_message == '1' or  incoming_message == '2':
                    self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_INDIVIDUAL_BY_NATIONAL_OR_PASSPORT)
                    return self.chat_proceed("Please enter ID Number here like 12345678A90", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)
            case app_settings.CHECK_CLIENT_INDIVIDUAL_BY_NATIONAL_OR_PASSPORT:
                return self.check_client_individual_by_national_passport(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_CHECK_OR_NOT:
                return self.get_client_check_or_not(incoming_message, phoneNumber, request, chat_session)
            case app_settings.SHOW_CLIENT_PAYMENT_REPORT:
                return self.show_client_payment_report(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CLIENT_INDIVIDUAL_NOT_FOUND:
                if incoming_message == '1':
                    self.update_main_state(phoneNumber, app_settings.GET_CLIENT_SURNAME)
                    return self.chat_proceed("Please add surname here", phoneNumber, user=None)
                else:
                    self.delete_session(phoneNumber)
                    return self.chat_end(self.menu_text.get("goodbye"), phoneNumber, user=None)
            case app_settings.CLIENT_GET_CHECK_OR_NOT:
                return self.client_get_check_or_not(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CLIENT_SHOW_PAYMENT_REPORT:
                return self.show_client_compay_payment_report(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CLIENT_COMPANY_NOT_FOUND:
                print("------------------------")
                if chat_session.search_type == app_settings.SEARCH_TYPE_COMPANY_REG_NUM:
                    if incoming_message == '1':
                        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_NAME)
                        return self.chat_proceed("Please enter company registered name in full", phoneNumber, user=None)
                    else:
                        self.delete_session(phoneNumber)
                        return self.chat_end(self.menu_text.get("goodbye"), phoneNumber, user=None)
                else:
                    if incoming_message == '1':
                        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_NUM)
                        return self.chat_proceed("Please enter Company Reg Number", phoneNumber, user=None)
                    else:
                        self.delete_session(phoneNumber)
                        return self.chat_end(self.menu_text.get("goodbye"), phoneNumber, user=None)
            case app_settings.GET_CLIENT_COMPANY_NAME:
                return self.get_client_company_name(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_COMPANY_NUM:
                return self.get_client_company_num(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_TRADING_NAME:
                return self.get_client_trading_name(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_COMPANY_ADDRESS:
                return self.get_client_company_address(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_CLIENT_COMPANY_TELEPHONE:
                return self.get_client_company_telephone(incoming_message, phoneNumber, request, chat_session)
            
            case app_settings.GET_CLIENT_COMPANY_MOBILE:
                return self.get_client_company_mobile(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_COMPANY_EMAIL:
                return self.get_client_company_email(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CLIENT_COMPANY_ABOUT_TO_CONFIRM:
                return self.client_company_about_to_confirm(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_SURNAME:
                return self.get_client_surname(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_FIRST_NAME:
                return self.get_client_first_name(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_ADDRESS:
                return self.get_client_address(incoming_message, phoneNumber, request, chat_session)
            case app_settings.GET_CLIENT_PHONE:
                return self.get_client_phone(incoming_message, phoneNumber, request, chat_session)
            case app_settings.CLIENT_ABOUT_TO_CONFIRM:
                return self.client_about_to_confirm(incoming_message, phoneNumber, request, chat_session)
            case _:
                request_user = CustomUser.objects.filter(user_id=phoneNumber).first()
                user_id = 0
                company_id = 0
                amount_owing_taken = 0
                amount_owing_given = 0
                score_level = ''

                if request_user:
                    user_id = request_user.id
                    company_id = request_user.company
                    data = clients_credit_dashboard(company_id)

                    try:
                        amount_owing_taken = data["client_credits_taken"][0]["amount_owing"]
                        amount_owing_given = data["client_credits_given"][0]["amount_owing"]
                        score_level = data["worst_credit_status"]["score_level"]
                    except:
                        pass

                if score_level == "HHR":
                    risk_level = "High High Risk"
                elif score_level == "LHR":
                    risk_level = "Low High Risk"
                elif score_level == "HLR":
                    risk_level = "High Low Risk"
                elif score_level == "NP":
                    risk_level = "Non Payer"
                else:
                    risk_level = "Low Low Risk"

                self.create_chat_session(phoneNumber, app_settings.GET_CLIENT_DASHBOARD, user_id, company_id)
                menu_text = f"Welcome {profileName}! \n\nYour Payment Status: *{risk_level}*\n\n*Net Status*\nCredit Taken: US${amount_owing_taken}\nCredit Given: US${amount_owing_given}\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"
                return self.chat_proceed(menu_text, phoneNumber, user=None)
                # self.create_chat_session(phoneNumber, app_settings.GET_CLIENT_DASHBOARD)
                # menu_text = f"Welcome {profileName}! \nYour Payment Status:\nHigh Risk-Upper\n*Net Status*\nCredit Taken: US$0.00\nCredit Given: US$0.00\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"
                # return self.chat_proceed(menu_text, phoneNumber, user=None)
   
    def active_lease_menu(self, incoming_message, phoneNumber, request, chat_session):
        self.delete_session(phoneNumber)
        return self.chat_proceed("Apologies, but the function is currently in development.", phoneNumber, user=None)
    
    def get_company_confirm_otp(self, incoming_message, phoneNumber, request, chat_session):
        result = create_company_lease_helper(chat_session)
        if result:
            # self.delete_session(phoneNumber)
            return self.chat_proceed("The lease has been successfully created.", phoneNumber, user=None)
        else:
            # self.delete_session(phoneNumber)
            return self.chat_proceed("The lease has not been created successfully.", phoneNumber, user=None)
    
    def get_company_confirm_lease_detail(self, incoming_message, phoneNumber, request, chat_session):
        #save lease to database
        if incoming_message == '1': #yes
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_CONFIMATION_OTP)
            return self.chat_proceed("Please enter lease acceptance code from tenant here.", phoneNumber, user=None)
        elif incoming_message == '2': #No
            self.delete_session(phoneNumber)
            return self.chat_proceed("Apologies, but the function is currently in development.", phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)

    def get_company_lease_four_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_four_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_CONFIRM_LEASE_DETAIL)
        is_variable = 'YES' if chat_session.is_lease_variable == '1' else 'NO'
        opening_balance = 0
        opening_balance += float(chat_session.lease_current_balance) + float(chat_session.lease_last_month_balance) + float(chat_session.lease_last_two_month_balance) + float(chat_session.lease_last_three_month_balance) + float(chat_session.lease_last_four_month_balance)
        msg = f"New Lease Details\nLesseee : COMPANY NAME\nMonthly Rental : {chat_session.lease_currency} {chat_session.lease_monthly_amount}\nMonthly rent variable: {is_variable}\nMonthly Payment Period: 25th day of every month to {chat_session.lease_pay_limit}th\nOpening Balance : {chat_session.lease_currency} {opening_balance}\nYour Payment Status : NOT SET\n1. Submit\n2. Edit\n3. Exit"
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_company_lease_three_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_three_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_FOUR_MONTH_RENT_BALANCE)
        return self.chat_proceed("4 months + rent balance\n1. Back\n2. Exit", phoneNumber, user=None)


    def get_company_lease_two_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_two_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_THREE_MONTH_RENT_BALANCE)
        return self.chat_proceed("3 months rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_company_lease_last_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_TWO_MONTH_RENT_BALANCE)
        return self.chat_proceed("2 months rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_company_lease_current_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_current_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_LAST_MONTH_RENT_BALANCE)
        return self.chat_proceed("Last month rent balance\n1. Back\n2. Exit", phoneNumber, user=None)
      

    def get_company_lease_payment_grace_period(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_pay_limit = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_CURRENT_RENT_BALANCE)
        return self.chat_proceed("Current rent balance - 25th to 7th\n1. Back\n2. Exit", phoneNumber, user=None)


    def get_company_lease_deposit(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_deposit = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_PAYMENT_GRACE_PERIOD)
        return self.chat_proceed("Payment period grace limit day : i.e 7\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_company_lease_is_variable(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message in ["1", "2"]:
            chat_session.is_lease_variable = incoming_message
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_DEPOSIT)
            return self.chat_proceed("Type deposit details; Date, Currency, Deposit Amount, Exchange Rat, Deposit period in months\n1. Back\n2. Exit", phoneNumber, user=None)
        elif incoming_message == '4':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
    def get_company_lease_monthly_rental_amount(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_monthly_amount = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_IS_VARIABLE)
        return self.chat_proceed("Is monthly rent variable?\n1. Yes\n2. No\n3. Back\n4. Exit", phoneNumber, user=None)

    def get_company_lease_currency(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            currency = "ZWG"
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (ZWG)", phoneNumber, user=None)
        elif incoming_message == '2':
            currency = 'USD'
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (USD)", phoneNumber, user=None)
            
        elif incoming_message == '3':
            currency = 'ZAR'
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (ZAR)", phoneNumber, user=None)
        elif incoming_message == '4':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        

    def get_company_lease_end_date(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_end_date = incoming_message
        chat_session.save()
        msg = f"Select Lease Currency\n1. ZWG\n2. USD\n3. ZAR\n4. Back\n5. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_CURRENCY)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_company_lease_start_date(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_start_date = incoming_message
        chat_session.save()
        msg = f"Enter Lease end date : dd-mm-yyyy\n\n1. Back\n2. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_END_DATE)
        return self.chat_proceed(msg, phoneNumber, user=None)

    def get_company_lease_guarantor_id(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.guarantor_id = incoming_message
        chat_session.save()
        msg = f"Enter Lease start date : dd-mm-yyyy\n\n1. Back\n2. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_START_DATE)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_company_lease_detail(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_detail = incoming_message
        chat_session.save()
        msg = f"Enter Rent Guarantor ID/Passport Number\n\n1. Back\n2. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_GUARANTOR_ID)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_company_lease_address(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_address = incoming_message
        chat_session.save()
        msg = f"Enter Lease details\n\n1. Back\n2. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_DETAIL)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_verified_company_registration(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message in ['1', '2']:
            msg = f"Enter Lease Address\n\n1. Back\n2. Exit"
            self.update_main_state(phoneNumber, app_settings.GET_COMPANY_LEASE_ADDRESS)
            return self.chat_proceed(msg, phoneNumber, user=None)

        elif incoming_message == '3':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)


    def get_new_company_lease_search_value(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        elif incoming_message == '2':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            if chat_session.search_type == app_settings.SEARCH_TYPE_COMPANY_REG_NUM:
                chat_session.company_reg = incoming_message
                chat_session.save()
                comp = Company.objects.filter(registration_number=incoming_message).first()
            else:
                chat_session.company_name = incoming_message
                chat_session.save()
                comp = Company.objects.filter(registration_name=incoming_message).first()

            
            if comp:
                
                self.update_main_state(phoneNumber, app_settings.GET_VERIFIED_COMPANY_REGISTRATION)
                chat_session.lease_receiver_company = comp.id
                chat_session.save()
                msg = f"{comp.registration_name} Reg #{comp.registration_number}\n\nVisually verified registration certificate?\n1. Yes\n2. No\n3. Back\n4. Exit"
            else:
                self.delete_session(phoneNumber)
                msg = f"Record not found"

            return self.chat_proceed(msg, phoneNumber, user=None)
        
    def get_lease_company_option(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message in ['1', '2']:
            msg = f"Enter Company Name\n1. Back\n2. Exit"
            if incoming_message == '2':
                chat_session.search_type = app_settings.SEARCH_TYPE_COMPANY_REG_NUM
                chat_session.save()
                msg = f"Enter Company Registration Number\n1. Back\n2. Exit"
            
            self.update_main_state(phoneNumber, app_settings.GET_NEW_COMPANY_LEASE_SEARCH_VALUE)
            return self.chat_proceed(msg, phoneNumber, user=None)

        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed('Invalid option, please try again', phoneNumber, user=None)

    def get_individual_confirmation_otp(self, incoming_message, phoneNumber, request, chat_session):
        # self.delete_session(phoneNumber)
        result = create_individual_lease_helper(chat_session)
        if result:
            self.delete_session(phoneNumber)
            return self.chat_proceed("The lease has been successfully created.", phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed("The lease has not been created successfully.", phoneNumber, user=None)
    def get_individual_confirm_lease_detail(self, incoming_message, phoneNumber, request, chat_session):
        #save lease to database
        if incoming_message == '1': #yes
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_CONFIMATION_OTP)
            return self.chat_proceed("Please enter lease acceptance code from tenant here.", phoneNumber, user=None)
        elif incoming_message == '2': #No
            self.delete_session(phoneNumber)
            return self.chat_proceed("Apologies, but the function is currently in development.", phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)

    def get_individual_lease_four_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_four_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_CONFIRM_LEASE_DETAIL)
        is_variable = 'YES' if chat_session.is_lease_variable == '1' else 'NO'
        opening_balance = 0
        opening_balance += float(chat_session.lease_current_balance) + float(chat_session.lease_last_month_balance) + float(chat_session.lease_last_two_month_balance) + float(chat_session.lease_last_three_month_balance) + float(chat_session.lease_last_four_month_balance)
        msg = f"New Lease Details\nLesseee : {chat_session.first_name} {chat_session.surname}\nMonthly Rental : {chat_session.lease_currency} {chat_session.lease_monthly_amount}\nMonthly rent variable: {is_variable}\nMonthly Payment Period: 25th day of every month to {chat_session.lease_pay_limit}th\nOpening Balance : {chat_session.lease_currency} {opening_balance}\nYour Payment Status : NOT SET\n1. Submit\n2. Edit\n3. Exit"
        return self.chat_proceed(msg, phoneNumber, user=None)

    def get_individual_lease_three_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_three_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_FOUR_MONTH_RENT_BALANCE)
        return self.chat_proceed("4 months + rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_individual_lease_two_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_two_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_THREE_MONTH_RENT_BALANCE)
        return self.chat_proceed("3 months rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_individual_lease_last_month_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_last_month_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_TWO_MONTH_RENT_BALANCE)
        return self.chat_proceed("2 months rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_individual_lease_current_rent_balance(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_current_balance = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_LAST_MONTH_RENT_BALANCE)
        return self.chat_proceed("Last month rent balance\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_individual_lease_payment_period(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_pay_limit = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_CURRENT_RENT_BALANCE)
        return self.chat_proceed("Current rent balance - 25th to 7th\n1. Back\n2. Exit", phoneNumber, user=None)

    def get_individual_lease_deposit(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_deposit = incoming_message
            chat_session.save()
        except:
            pass
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_PAYMENT_GRACE_PERIOD)
        return self.chat_proceed("Payment period grace limit day : i.e 7\n1. Back\n2. Exit", phoneNumber, user=None)

        
    def get_individual_lease_is_variable(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message in ["1", "2"]:
            chat_session.is_lease_variable = incoming_message
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_DEPOSIT)
            return self.chat_proceed("Type deposit details; Date, Currency, Deposit Amount, Exchange Rat, Deposit period in months\n1. Back\n2. Exit", phoneNumber, user=None)
        elif incoming_message == '4':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
    def get_individual_lease_monthly_rental_amount(self, incoming_message, phoneNumber, request, chat_session):
        chat_session.lease_monthly_amount = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_IS_VARIABLE)
        return self.chat_proceed("Is monthly rent variable?\n1. Yes\n2. No\n3. Back\n4. Exit", phoneNumber, user=None)

    def get_individual_lease_currency(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            currency = "ZWG"
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (ZWG)", phoneNumber, user=None)
        elif incoming_message == '2':
            currency = 'USD'
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (USD)", phoneNumber, user=None)
            
        elif incoming_message == '3':
            currency = 'ZAR'
            chat_session.lease_currency = currency
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_MONTHLY_RENTAL_AMOUNT)
            return self.chat_proceed("Monthly rental amount (ZAR)", phoneNumber, user=None)
        elif incoming_message == '4':
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        
    def get_individual_lease_end_date(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_end_date = incoming_message
            chat_session.save()
        except:
            pass

        msg = f"Select Lease Currency\n1. ZWG\n2. USD\n3. ZAR\n4. Back\n5. Exit"
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_CURRENCY)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_individual_lease_start_date(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_start_date = incoming_message
            chat_session.save()
        except:
            pass

        msg = f"Enter Lease end date : dd-mm-yyyy"
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_END_DATE)
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_individual_lease_detail(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_detail = incoming_message
            chat_session.save()
        except:
            pass

        msg = f"Enter Lease start date : dd-mm-yyyy"
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_START_DATE)
        return self.chat_proceed(msg, phoneNumber, user=None)

    def get_individual_lease_address(self, incoming_message, phoneNumber, request, chat_session):
        try:
            chat_session.lease_address = incoming_message
            chat_session.save()
        except:
            pass

        msg = f"Enter Lease details"
        self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_DETAIL)
        return self.chat_proceed(msg, phoneNumber, user=None)

    def get_is_individualid_visually_verified(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            #yes
            msg = f"Enter Lease address"
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_ADDRESS)
            return self.chat_proceed(msg, phoneNumber, user=None)
        
        elif incoming_message == '2':
            #no
            msg = f"Enter Lease address"
            self.update_main_state(phoneNumber, app_settings.GET_INDIVIDUAL_LEASE_ADDRESS)
            return self.chat_proceed(msg, phoneNumber, user=None)
        elif incoming_message == '3':
            #back
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
            
    
    
    def get_lease_individual_nationalid(self, incoming_message, phoneNumber, request, chat_session):
        try:
            ind =  Individual.objects.filter(identification_number=incoming_message).first()
        except Individual.DoesNotExist:
            ind = Individual.objects.none

        if ind:
            #temp store individual id in national_id
            chat_session.national_id = ind.identification_number
            chat_session.first_name = ind.firstname
            chat_session.surname = ind.surname
            chat_session.save()
            msg = f"{ind.firstname} {ind.surname} - {ind.identification_number}\nVisually verified ID?\n1. Yes\n2. No\n3. Back\n4. Exit"
            self.update_main_state(phoneNumber, app_settings.GET_IS_INDIVIDUALID_VISUALLY_VERIFIED)
            return self.chat_proceed(msg, phoneNumber, user=None)
        else:
            mssg = f"Sorry, that ID was not found in our database."
            self.delete_session(phoneNumber)
            return self.chat_proceed(mssg, phoneNumber, user=None)


    def new_lease_type(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            #individual lease
            self.update_main_state(phoneNumber, app_settings.GET_LEASE_INDIVIDUAL_NATIONALID)
            return self.chat_proceed("Enter Individual's ID# like 12345868G54", phoneNumber, user=None)
        elif incoming_message == '2':
            #company lease
            self.update_main_state(phoneNumber, app_settings.GET_LEASE_COMPANY_OPTION)
            return self.chat_proceed("Search option\n1. Company Name\n2. Registration Number", phoneNumber, user=None)
        elif incoming_message == '3':
            #back
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        else:
            #exit
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        
    def get_rentsafe_options(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            leases = client_leases_new(chat_session) 
            msg = 'ACTIVE LEASES\n'
            try:
                for i in leases:
                    msg += f"Lease ID: {i['lease_id']}\nLeasee: {i['name']}\nAddress: {i['address']}\nBalance {i['currency']} {i['owing_amount']}\n\n"
            except:
                pass

            msg += f"----------------------------\n"
            msg += f"Enter *lease ID* to view details\n"
            msg += f"1. Back\n2. Exit"

            #active lease
            # self.delete_session(phoneNumber)
            self.update_main_state(phoneNumber, app_settings.ACTIVE_LEASE_MENU)
            return self.chat_proceed(msg, phoneNumber, user=None)
        elif incoming_message == '2':
            data = open_subscription(chat_session)
            print("data------------", data)
            individual_open_slots = 0
            company_open_slots = 0
            try:
                for sub in data:
                    if sub["subscription_class"] == "individual":
                        individual_open_slots = sub["open_slots"]
                    elif sub["subscription_class"] == "company":
                        company_open_slots = sub["open_slots"]
            except:
                pass
            #new lease
            self.update_main_state(phoneNumber, app_settings.NEW_LEASE_TYPE)
            msg = f"Create Lease\n1 Individual {individual_open_slots} Subs\n2 Company {company_open_slots} Subs\n3 Back\n4 Exit"
            return self.chat_proceed(msg, phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
        
    def client_company_about_to_confirm(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            try:
                new_comp = Company(
                   registration_name = chat_session.company_name,
                   registration_number = chat_session.company_reg,
                   trading_name = chat_session.trading_name,
                   company_uploader = 'ChatBot'
                )
                new_comp.save()
                if new_comp:
                    CompanyProfile.objects.create(
                        company = new_comp.id,
                        current_address = chat_session.company_address,
                        mobile_phone = chat_session.company_mobile,
                        landline_phone = chat_session.company_telephone,
                        email = chat_session.company_email
                    )
            except:
                pass
            self.delete_session(phoneNumber)
            return self.chat_proceed('The Company has successfully recorded.', phoneNumber, user=None)
        elif incoming_message == '2':
            self.delete_session(phoneNumber)
            return self.chat_end("Apologies, but the function is currently in development.", phoneNumber, user=None)
        elif incoming_message == '3':
            self.update_main_state(phoneNumber, app_settings.GET_CLIENT_DASHBOARD)
            menu_text = f"Welcome User! \nYour Payment Status:\nHigh Risk-Upper\n*Net Status*\nCredit Taken: US$0.00\nCredit Given: US$0.00\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"

            return self.chat_proceed(menu_text, phoneNumber, user=None)
        else:
            #real
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
    def get_client_company_email(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_email = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.CLIENT_COMPANY_ABOUT_TO_CONFIRM)
        msg = f"You have added the company;\nRegistered Name: {chat_session.company_name}\nTrading name: {chat_session.trading_name}\nReg. Number: {chat_session.company_reg}\nAddress: {chat_session.company_address}\nTelephone Number :{chat_session.company_telephone}\nEmail Address: {chat_session.company_email}\n\n1. Confirm\n2. Edit details\n3. Return to main menu\n4. Exit"
        return self.chat_proceed(msg, phoneNumber, user=None)
    
    def get_client_company_mobile(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_mobile = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_EMAIL)
        return self.chat_proceed("Add email address", phoneNumber, user=None)
    
    def get_client_company_telephone(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_telephone = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_MOBILE)
        return self.chat_proceed("Add mobile number", phoneNumber, user=None)
    
    def get_client_company_address(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_address = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_TELEPHONE)
        return self.chat_proceed("Add telephone number", phoneNumber, user=None)
    
    def get_client_trading_name(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.trading_name = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_COMPANY_ADDRESS)
        return self.chat_proceed("Please add here office address in the format; Office 5, 2nd Floor, Club Chambers, 98 3rd Street, , Bulawayo, Zimbabwe", phoneNumber, user=None)
    

    def get_client_company_name(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_name = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_TRADING_NAME)
        return self.chat_proceed("Please enter company trading name", phoneNumber, user=None)
    
    def get_client_company_num(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.company_reg = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_TRADING_NAME)
        return self.chat_proceed("Please enter company trading name", phoneNumber, user=None)
    
    def get_company_address(self, company_id):
        try:
            # Assuming you have a Company model and it has an address field
            company = CompanyProfile.objects.get(company=company_id)
            address = company.current_address  # Replace 'address' with the actual field name
        except CompanyProfile.DoesNotExist:
            address = ''
    
        return address

    def show_client_compay_payment_report(self, incoming_message, phoneNumber, request, chat_session):
        try:
            comp =  Company.objects.filter(id=chat_session.search_value).first()
        except Company.DoesNotExist:
            comp = Company.objects.none
        
        otp = OTP.objects.filter(otp_type=settings.CREDIT_CHECK, request_user=chat_session.user_id, requested_user=comp.id).last()
        if otp:
           
            if self.is_otp_expired(otp):
                msg = f"OTP is expired"
                self.delete_session(phoneNumber)
                return self.chat_proceed(msg, phoneNumber, user=None) 
            else:
                print("OTP is valid")
                pass
        else:
            msg = f"OTP not found"
            self.delete_session(phoneNumber)
            return self.chat_proceed(msg, phoneNumber, user=None) 
         
        active_lease = 0
        arears = 0
        if comp:
            credit_details, historic_claims_list, risk_data, score_range = company_report(request, chat_session)
            active_lease = len(credit_details)
            arears = len(historic_claims_list)

            address = self.get_company_address(comp.id)
            if score_range['class'] == "HHR":
                risk_level = "High High Risk"
                emoji = '🟥'
                if risk_data['class'] == 'non-payer':
                    risk_level = "Non Payer"
                    emoji = '⬛'
                # emoji = '🟥'

            elif score_range['class'] == "LHR":
                risk_level = "Low High Risk"
                emoji = '🟧'

            elif score_range['class'] == "HLR":
                risk_level = "High Low Risk"
                emoji = '🟪'

            elif score_range['class'] == "NP":
                risk_level = "Non Payer"
                emoji = '⬛'

            else:
                risk_level = "Low Low Risk"
                emoji = '🟩'
            mssg = f"Payment Status Report\n{comp.registration_name} - Reg#{comp.registration_number}\nListed Address - {address}\nStatus - {risk_level} {emoji}\nActive Leases - {active_lease}\nIn Arrears - {arears}\n\n1. Exit "
        else:
            mssg = "Failed to fetch the repor"
        
        self.delete_session(phoneNumber)
        return self.chat_proceed(mssg, phoneNumber, user=None)
    
    def client_get_check_or_not(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            msg = "Please enter here checking access code supplied"
            print("msg-------------",msg)
            # send SMS  -access token
            # try:
            company_ob = Company.objects.get(id=chat_session.search_value)
            if company_profile := CompanyProfile.objects.filter(
                company=int(company_ob.id)
            ).first():
                email = company_profile.email or "N/A"
                print('---------------email', email)
                send_credit_check_email.delay(
                    generate_otp(),
                    email,
                    company_ob.trading_name,
                    settings.CREDIT_CHECK,
                    chat_session.user_id,
                    company_ob.id,
                )
            # except:
            #     print("error email failed.....................")
            #     pass
            self.update_main_state(phoneNumber, app_settings.CLIENT_SHOW_PAYMENT_REPORT)
            return self.chat_proceed(msg, phoneNumber, user=None)
        elif incoming_message == '2':
            self.update_main_state(phoneNumber, app_settings.GET_CLIENT_DASHBOARD)
            menu_text = f"Hello User! \nYour Payment Status:\nHigh Risk-Upper\n*Net Status*\nCredit Taken: US$0.00\nCredit Given: US$0.00\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"
            return self.chat_proceed(menu_text, phoneNumber, user=None)
        elif incoming_message == '3':
            self.delete_session(phoneNumber)
            return self.chat_end(self.menu_text.get("session_end"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)

    def check_client_company_name(self, incoming_message, phoneNumber, request, chat_session):
        try:
            comp =  Company.objects.filter(registration_name=incoming_message).first()
        except Company.DoesNotExist:
            comp = Company.objects.none

        if comp:
            chat_session.company_name = incoming_message
            chat_session.search_value = comp.id #company id
            chat_session.save()
            mssg = f"Company found;\n{comp.registration_name} - Reg#{comp.registration_number}\n1. Request check access\n2. Back to Company check\n3. Exit"
            self.update_main_state(phoneNumber, app_settings.CLIENT_GET_CHECK_OR_NOT)

            return self.chat_proceed(mssg, phoneNumber, user=None) 
        else:
            chat_session.company_name = incoming_message
            chat_session.save()
            mssg = f"Sorry, that name was not found in our database. Would you like to add it?\n1. Yes\n2. No"
            #save national id
            self.update_main_state(phoneNumber, app_settings.CLIENT_COMPANY_NOT_FOUND)

            return self.chat_proceed(mssg, phoneNumber, user=None) 
    
    def check_client_company_reg(self, incoming_message, phoneNumber, request, chat_session):
        try:
            comp =  Company.objects.filter(registration_number=incoming_message).first()
        except Company.DoesNotExist:
            comp = Company.objects.none

        if comp:
            chat_session.company_name = comp.registration_name
            chat_session.search_value = comp.id #company id
            chat_session.save()
            mssg = f"Company found;\n{comp.registration_name} - Reg#{comp.registration_number}\n1. Request check access\n2. Back to Company check\n3. Exit"
            self.update_main_state(phoneNumber, app_settings.CLIENT_GET_CHECK_OR_NOT)
            return self.chat_proceed(mssg, phoneNumber, user=None) 
        else:
            chat_session.company_reg = incoming_message
            chat_session.save()
            mssg = f"Sorry, that ID was not found in our database. Would you like to add it?\n1. Yes\n2. No"
            #save national id
            self.update_main_state(phoneNumber, app_settings.CLIENT_COMPANY_NOT_FOUND)

            return self.chat_proceed(mssg, phoneNumber, user=None) 
    
        


    def client_about_to_confirm(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            try:
                Individual.objects.create(
                    national_id = chat_session.national_id,
                    firstname = chat_session.first_name,
                    surname = chat_session.surname,
                    mobile = chat_session.phone,
                    address = chat_session.address,
                    identification_number = chat_session.national_id
                )
            except:
                pass
            self.delete_session(phoneNumber)
            return self.chat_proceed('The user has successfully recorded.', phoneNumber, user=None)
        elif incoming_message == '2':
            self.delete_session(phoneNumber)
            return self.chat_end("Apologies, but the function is currently in development.", phoneNumber, user=None)
        elif incoming_message == '3':
            self.update_main_state(phoneNumber, app_settings.GET_CLIENT_DASHBOARD)
            menu_text = f"Welcome User! \nYour Payment Status:\nHigh Risk-Upper\n*Net Status*\nCredit Taken: US$0.00\nCredit Given: US$0.00\n\n*Options*\n1. Payment Status Check\n2. Services\n3. Accounting\n4. Subscriptions\n5. Exit"

            return self.chat_proceed(menu_text, phoneNumber, user=None)
        else:
            #real
            self.delete_session(phoneNumber)
            return self.chat_proceed(self.menu_text.get("goodbye"), phoneNumber, user=None)
    
    def get_client_phone(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.phone = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.CLIENT_ABOUT_TO_CONFIRM)
        mssg = f"You have added the individual;\n {chat_session.first_name} {chat_session.surname} \nID Number: {chat_session.national_id} \nAddress : {chat_session.address} \nMobile Number : {incoming_message}\n\n1. Confirm\n2. Edit details\n3. Return to main menu\n4. Exit"
        return self.chat_proceed(mssg, phoneNumber, user=None)
    
    def get_client_address(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.address = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_PHONE)
        return self.chat_proceed("Please add mobile number in the format; 0772222222", phoneNumber, user=None)
    
    def get_client_first_name(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.first_name = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_ADDRESS)
        return self.chat_proceed("Please add here residential address in the format; 2 Grade Close, Mukumba, Marondera, Zimbabwe", phoneNumber, user=None)

    def get_client_surname(self, incoming_message, phoneNumber, request, chat_session):
        #validate here 
        chat_session.surname = incoming_message
        chat_session.save()
        self.update_main_state(phoneNumber, app_settings.GET_CLIENT_FIRST_NAME)
        return self.chat_proceed("Please add first name here", phoneNumber, user=None)
    
    def is_otp_expired(self,otp):
        """
        Check if the given OTP instance is expired.
        """
        return otp.expire_at < timezone.now()
    def show_client_payment_report(self, incoming_message, phoneNumber, request, chat_session):
        #check otp
        try:
            ind =  Individual.objects.filter(identification_number=chat_session.national_id).first()
        except Individual.DoesNotExist:
            ind = Individual.objects.none

        otp = OTP.objects.filter(otp_type=settings.CREDIT_CHECK, request_user=chat_session.company_id, requested_user=ind.id).last()
        if otp:
           
            if self.is_otp_expired(otp):
                msg = f"OTP is expired"
                self.delete_session(phoneNumber)
                return self.chat_proceed(msg, phoneNumber, user=None) 
            else:
                print("OTP is valid")
                pass
        else:
            msg = f"OTP not found"
            self.delete_session(phoneNumber)
            return self.chat_proceed(msg, phoneNumber, user=None) 
         
            
        # self.delete_session(phoneNumber)
        active_lease = 0
        arears = 0
        if ind:
            credit_details, historic_claims_list, risk_data, score_range =  individual_report(request, chat_session)
            print('--------risk_data', risk_data)
            print('--------score_rangeccccc', score_range)
            active_lease = len(credit_details)
            arears = len(historic_claims_list)
            if score_range['class'] == "HHR":
                risk_level = "High High Risk"
                emoji = '🟥'
                if risk_data['class'] == 'non-payer':
                    risk_level = "Non Payer"
                    emoji = '⬛'
                # emoji = '🟥'

            elif score_range['class'] == "LHR":
                risk_level = "Low High Risk"
                emoji = '🟧'

            elif score_range['class'] == "LMR":
                risk_level = "Medium Risk"
                emoji = '🟧'

            elif score_range['class'] == "HLR":
                risk_level = "High Low Risk"
                emoji = '🟪'

            elif score_range['class'] == "NP":
                risk_level = "Non Payer"
                emoji = '⬛'

            else:
                risk_level = "Low Low Risk"
                emoji = '🟩'
            mssg = f"Payment Status Report\n{ind.identification_number} - {ind.firstname} {ind.surname}\nListed Address - {ind.address}\nStatus - {risk_level} {emoji}\nActive Leases - {active_lease}\nIn Arrears - {arears}\n\n1. Exit "
        else: 
            mssg = "Failed to fetch the repor"
        self.delete_session(phoneNumber)
        return self.chat_proceed(mssg, phoneNumber, user=None)
    
    def check_client_individual_by_national_passport(self, incoming_message, phoneNumber, request, chat_session):
        try:
            ind =  Individual.objects.filter(identification_number=incoming_message).first()
        except Individual.DoesNotExist:
            ind = Individual.objects.none


        if ind:
            mssg = f"ID Number found; {ind.identification_number} - {ind.firstname} {ind.surname}\n1. Request check access\n2. Back to Individual check\n3. Exit"
            chat_session.national_id = incoming_message
            chat_session.save()
            self.update_main_state(phoneNumber, app_settings.GET_CLIENT_CHECK_OR_NOT)
            return self.chat_proceed(mssg, phoneNumber, user=None) 
        else:
            chat_session.national_id = incoming_message
            chat_session.save()
            mssg = f"Sorry, that ID number was not found in our database. Would you like to add it?\n1. Yes\n2. No"
            #save national id
            self.update_main_state(phoneNumber, app_settings.CLIENT_INDIVIDUAL_NOT_FOUND)

            return self.chat_proceed(mssg, phoneNumber, user=None) 
    
    def get_client_check_or_not(self, incoming_message, phoneNumber, request, chat_session):
        if incoming_message == '1':
            msg = "Please enter here checking access code supplied"
            # send SMS  -access token
            try:
                request_user_company = Company.objects.filter(
                id=chat_session.company_id
                ).first()
                name = request_user_company.trading_name if request_user_company else "N/A"
                message = f"Accept Credit Check on CrediSafe from {name} ? Give OTP below as confirmation."
                otp = generate_otp()
                individual_ob = Individual.objects.get(identification_number=chat_session.national_id)
                mobile = individual_ob.mobile
                with contextlib.suppress(Exception):
                    send_otp.delay(
                        request.build_absolute_uri(),
                        otp,
                        mobile,
                        # mobile,
                        chat_session.company_id,
                        # request.user.company,
                        individual_ob.id,
                        "individual",
                        settings.CREDIT_CHECK,
                        message,
                    )
                print("message sent----------------------")
            except:
                print("message error----------------------")
                pass
            self.update_main_state(phoneNumber, app_settings.SHOW_CLIENT_PAYMENT_REPORT)
            return self.chat_proceed(msg, phoneNumber, user=None)
        elif incoming_message == '2':
            self.update_main_state(phoneNumber, app_settings.CHECK_CLIENT_INDIVIDUAL_BY)
            return self.chat_proceed("Individual check by;\n1. ID Number\n2. Passport Number", phoneNumber, user=None)
        elif incoming_message == '3':
            self.delete_session(phoneNumber)
            return self.chat_end(self.menu_text.get("session_end"), phoneNumber, user=None)
        else:
            self.delete_session(phoneNumber)
            return self.chat_proceed("Invalid option, please try again", phoneNumber, user=None)


    def get(self, request):
        mode = request.GET['hub.mode']
        token = request.GET['hub.verify_token']
        challenge = request.GET['hub.challenge']
        print(settings.WHATSAPP_VERIFY_TOKEN)
        if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
            return HttpResponse(challenge, status=200)
        else:
            return HttpResponse("error", status=403)

    def post(self, request):

        data = json.loads(request.body)
     
        # print('tfa data',data)
        if "object" in data and "entry" in data and data:
            if data["object"] == "whatsapp_business_account":
                try:
                    for entry in data["entry"]:
                        # phoneNumber = entry["changes"][0]["value"]["metadata"]["display_phone_number"]
                        phoneId = entry["changes"][0]["value"]["metadata"]["phone_number_id"]
                        profileName = entry["changes"][0]["value"]["contacts"][0]["profile"]["name"]
                        whatsAppId = entry["changes"][0]["value"]["contacts"][0]["wa_id"]
                        app_phoneNumber = entry["changes"][0]["value"]["messages"][0]["from"]
                        messageId = entry["changes"][0]["value"]["messages"][0]["id"]
                        timestamp = entry["changes"][0]["value"]["messages"][0]["timestamp"]
                        message_type = entry["changes"][0]["value"]["messages"][0]["type"]
                        print("message_type", message_type)
                        if message_type in ['document']:
                            
                            media_url = entry["changes"][0]["value"]["messages"][0]["document"]["id"]#['document']['id']
                            incoming_message = ""
                        elif message_type in ['image']:
                            
                            media_url = entry["changes"][0]["value"]["messages"][0]["image"]["id"]#['document']['id']
                            incoming_message = ""
                        elif message_type in ['video']:
                            media_url = entry["changes"][0]["value"]["messages"][0]["video"]["id"]#['document']['id']
                            incoming_message = ""   
                        else:
                            media_url = ""
                            incoming_message = entry["changes"][0]["value"]["messages"][0]["text"]["body"]

                        # media_url = ""
                        # message = "Welcome user"
                        # return self.chat_proceed(message, phoneNumber, user=None)
                        phoneNumber =f"+{app_phoneNumber}"
                        # client = Clients.objects.filter(mobile=phoneNumber).first()
                        chat_session = ChatUserSession.objects.filter(mobile=phoneNumber).first()
                        # return self.chat_proceed("Hello User", phoneNumber, "real")
                      
                        if self.is_user_type_admin(phoneNumber):
                            print("is_user_type_admin............")
                            return self.process_level_one_welcome_admin(
                                chat_session,
                                incoming_message,
                                phoneNumber,
                                profileName,
                                request,
                                media_url,
                            )
                        else:
                            return self.process_level_one_welcome_client(
                                chat_session,
                                incoming_message,
                                phoneNumber,
                                profileName,
                                request,
                                media_url,
                            )
                        
                except:
                    print("Error...................")
                    pass

        return HttpResponse('success', status=200)
    

def validate_subscriptions(company_id, sub_class):
    subscription = Subcsriptions.objects.filter(
        is_activated=True, subscriber_id=company_id, subscription_class=sub_class
    ).first()
    if subscription:
        active_leases = Lease.objects.filter(
            lease_giver=company_id, is_active=True, subscription=subscription.id
        ).count()
        return int(subscription.number_of_subscriptions) > active_leases
    return False

def create_individual_lease_helper(data):
    identificationNumber = data.national_id.upper()
    
    if is_eligible := validate_subscriptions(data.company_id, "individual"):
        print("is_eligible------------------")
        sub_id = Subcsriptions.objects.filter(
            is_activated=True,
            subscriber_id=data.company_id,
            subscription_class="individual",
        ).first()
        balance_amount = float(data.lease_current_balance) + float(data.lease_last_two_month_balance) + float(data.lease_last_month_balance) + float(data.lease_last_three_month_balance) + float(data.lease_last_four_month_balance)
        ind_lease = True
        # add landlord to lease
        landlord_id = None
        
        lease = Lease(
            reg_ID_Number=identificationNumber,
            lease_giver=data.company_id,
            lease_activator=data.user_id,
            address=data.lease_address,
            leasee_mobile='',
            is_individual=True,
            is_active=True,
            landlord_id = 0,
            lease_details=data.lease_detail,
            start_date=convert_date_format(data.lease_start_date),
            # rent_guarantor_id=data.get("rentGuarantorId",identificationNumber).upper(),
            end_date=convert_date_format(data.lease_end_date),
            currency=data.lease_currency,
            deposit_amount=data.lease_deposit,
            deposit_period=0,
            lease_period=12,
            monthly_rentals=data.lease_monthly_amount,
            subscription=int(sub_id.id),
            rent_variables=True if data.is_lease_variable == '1' else False,
            payment_period_start=25,
            payment_period_end=data.lease_pay_limit
        )
        lease.save()
           


        opening_balance = Opening_balance(
            lease_id=lease.lease_id,
            current_month=data.lease_current_balance,
            one_month_back=data.lease_last_month_balance,
            two_months_back=data.lease_last_two_month_balance,
            three_months_back=data.lease_last_three_month_balance,
            three_months_plus=data.lease_last_four_month_balance,
            outstanding_balance=balance_amount,
        )
        opening_balance.save()

        
        if float(data.lease_last_four_month_balance) > 0:
            lease.status = "NON-PAYER"
            lease.status_cache = "NON-PAYER"
        elif float(data.lease_last_three_month_balance) > 0:
            lease.status = "HIGH-HIGH"
            lease.status_cache = "HIGH-HIGH"
        elif float(data.lease_last_two_month_balance) > 0:
            lease.status = "HIGH"
            lease.status_cache = "HIGH"
        elif float(data.lease_last_month_balance) > 0:
            lease.status = "MEDIUM"
            lease.status_cache = "MEDIUM"
        else:
            pass
        lease.save()
        lease_year, lease_month, lease_day = data.lease_start_date.split("-")
        month_name = (
            str(calendar.month_name[int(lease_month)]) + " " + str(lease_year)
        )

        reference = "Opening Balance"
        lease_payment = LeasePayments(
            lease_id=lease.lease_id,
            payment_amount=0,
            date=data.lease_start_date,
            month=month_name,
            payment_reference=reference,
            owing_amount=balance_amount,
            balance_amount=balance_amount,
            is_balance_checked=True,
        )
        lease_payment.save()
        lease_receiver = Individual.objects.filter(
            national_id=identificationNumber
        ).first()
        request_user_company = Company.objects.filter(
            id=data.company_id
        ).first()
        name = request_user_company.trading_name if request_user_company else "N/A"

        if lease_receiver:
            full_name = lease_receiver.firstname + " " + lease_receiver.surname

        rent_variables = "Yes" if data.is_lease_variable == '1' else "No"
        remarks = "Please pay your rental arrears to improve your payment status."
        if lease.status_cache == "SAFE":
            payment_status = "Low Risk"
            remarks = ""
        elif lease.status_cache == "HIGH-HIGH" or lease.status_cache == "HIGH":
            payment_status = "High Risk"
        else:
            payment_status = lease.status_cache
        message = f"Your current lease details with {name} .\nLessee : {full_name}\nMonthly Rental : {lease.currency} {lease.monthly_rentals}0\nMonthly rent variable : {rent_variables}\nMonthly Payment Period : {lease.payment_period_start}th day of every month to {lease.payment_period_end}th.\nYour Opening Balance: USD {opening_balance.outstanding_balance}0\nYour Payment Status: {payment_status}\n {remarks}"
        message_preview = f"Your current lease details with {name}: Lessee - {full_name}; Monthly Rental - {lease.currency} {lease.monthly_rentals}0; Monthly rent variable - {rent_variables}; Monthly Payment Period - {lease.payment_period_start}th day of every month to {lease.payment_period_end}th; Your Opening Balance - USD {opening_balance.outstanding_balance}0; Your Payment Status - {payment_status}\n {remarks}"
        
        return True
    else:
        print("NOT is_eligible==========")
        return False


def convert_date_format(date_str):
    """
    Convert a date from DD-MM-YYYY format to YYYY-MM-DD format.
    
    Args:
        date_str (str): Date string in DD-MM-YYYY format.
    
    Returns:
        str: Date string in YYYY-MM-DD format.
    """
    try:
        # Parse the input date string
        date_obj = datetime.strptime(date_str, '%d-%m-%Y')
        # Format the date to the desired format
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        return "Invalid date format. Please use DD-MM-YYYY."

def create_company_lease_helper(data):
    is_eligible = validate_subscriptions(data.company_id, "company")
    lease_receiver_company = Company.objects.filter(id=data.company_reg).first()

    print("----------------init company lease")
    if is_eligible:
        sub_id = Subcsriptions.objects.filter(
            is_activated=True,
            subscriber_id=data.company_id,
            subscription_class="company",
        ).first()
        
        balance_amount = float(data.lease_current_balance) + float(data.lease_last_two_month_balance) + float(data.lease_last_month_balance) + float(data.lease_last_three_month_balance) + float(data.lease_last_four_month_balance)
        comp_lease = True
        landlord_id = None

        print("--------------eligibility")
        lease = Lease(
            reg_ID_Number=data.lease_receiver_company,
            lease_giver=data.company_id,
            lease_activator=data.user_id,
            address=data.lease_address,
            leasee_mobile='',
            # rent_guarantor_id=data.get("rentGuarantorId").upper(),
            is_company=comp_lease,
            landlord_id=0,
            is_active=True,
            lease_details=data.lease_detail,
            start_date=convert_date_format(data.lease_start_date),
            end_date=convert_date_format(data.lease_end_date),
            currency=data.lease_currency,
            deposit_amount=data.lease_deposit,
            deposit_period=0,
            lease_period=12,
            monthly_rentals=data.lease_monthly_amount,
            subscription=int(sub_id.id),
            rent_variables=True if data.is_lease_variable == '1' else False,
            payment_period_start=25,
            payment_period_end=data.lease_pay_limit
        )
       
        lease.save()
        print("================lease created")
        opening_balance = Opening_balance(
            lease_id=lease.lease_id,
            current_month=data.lease_current_balance,
            one_month_back=data.lease_last_month_balance,
            two_months_back=data.lease_last_two_month_balance,
            three_months_back=data.lease_last_three_month_balance,
            three_months_plus=data.lease_last_four_month_balance,
            outstanding_balance=balance_amount,
        )
        opening_balance.save()
        if float(data.lease_last_four_month_balance) > 0:
            lease.status = "NON-PAYER"
            lease.status_cache = "NON-PAYER"
        elif float(data.lease_last_three_month_balance) > 0:
            lease.status = "HIGH-HIGH"
            lease.status_cache = "HIGH-HIGH"
        elif float(data.lease_last_two_month_balance) > 0:
            lease.status = "HIGH"
            lease.status_cache = "HIGH"
        elif float(data.lease_last_month_balance) > 0:
            lease.status = "MEDIUM"
            lease.status_cache = "MEDIUM"
        else:
            pass
        lease.save()

        lease_year, lease_month, lease_day = data.lease_start_date.split("-")
        month_name = (
            str(calendar.month_name[int(lease_month)]) + " " + str(lease_year)
        )
        reference = "Opening Balance"
        lease_payment = LeasePayments(
            lease_id=lease.lease_id,
            payment_amount=0,
            date=data.lease_start_date,
            month=month_name,
            payment_reference=reference,
            owing_amount=balance_amount,
            balance_amount=balance_amount,
            is_balance_checked=True,
        )
        lease_payment.save()
        
        return True
    else:
        print("NOT is_eligible==========")
        return False


def open_subscription(data):
    user_company = Company.objects.filter(id=data.company_id).first()
    subscriptions = Subcsriptions.objects.filter(subscriber_id=user_company.id)
    sub_dic = {}
    sub_list = []

    for sub in subscriptions:
        activated_leases = Lease.objects.filter(
            lease_giver=user_company.id, is_active=True, subscription=sub.id
        ).count()
        subscription_slots = int(sub.number_of_subscriptions) - int(activated_leases)
        if sub.id not in sub_dic.keys():
            service = Services.objects.filter(id=sub.service_id).first()
            period_ob = SubcsriptionPeriod.objects.filter(id=sub.period).first()
            period = period_ob.name
            if period == "Yearly":
                period_length = 12
            elif period == "Half-Yearly":
                period_length = 6
            elif period == "Quartely":
                period_length = 3
            else:
                period_length = "N/A"
            datetime_string = sub.start_date
            datetime_obj = datetime.fromisoformat(f"{datetime_string}")
            sub_start = datetime_obj.strftime("%Y-%m-%d")
            sub_start_date = datetime.strptime(sub_start, "%Y-%m-%d").date()
            sub_end = datetime_obj + relativedelta(months=period_length)
            datetime_ob = datetime.fromisoformat(f"{sub_end}")
            sub_end = datetime_ob.strftime("%d-%B-%Y")
            now = date.today()
            sub_end_date = datetime.strptime(sub_end, "%d-%B-%Y").date()
            if sub_start_date <= now:
                days_remaining = (sub_end_date - now).days
                if days_remaining > 0:
                    months_remaining = days_remaining // 30
                else:
                    months_remaining = 0

            start_date = sub.start_date.strftime("%d-%B-%Y")
            end_date = sub.end_date.strftime("%d-%B-%Y")
            if service and period_ob and int(months_remaining) > 0:
                sub_dic.update(
                    {
                        sub.id: {
                            "sub_id": sub.id,
                            "subscription_class": sub.subscription_class,
                            "service": service.service_name,
                            "period_left": months_remaining,
                            "period_length": period_length,
                            "open_slots": subscription_slots,
                            "start_date": start_date,
                            "end_date": end_date,
                        }
                    }
                )

    for key, value in sub_dic.items():
        sub_list.append(value)

    return sub_list


def client_leases_new(data):
    # get query parameters
    search_value = ''
    page_number = 1
    color_filter = ''

    # pagination variables
    items_per_page = 200

    # initialize variables
    name, rent_guarantor, mobile, email, trading_name = "", "", "", "", ""
    owing_amount, color = 0, "success"
    
    # get all leases that match the query
    names_list = search_value.split()
    fname = names_list[0] if len(names_list) > 0 else ""
    sname = names_list[1] if len(names_list) > 1 else fname
    # get individual and company ids
    individual_ids = Individual.objects.filter(
        Q(firstname__icontains=fname) | Q(surname__icontains=sname) | Q(identification_number__icontains=search_value)
    ).values("identification_number")

    company_ids = Company.objects.filter(
        Q(registration_name__icontains=search_value) | Q(trading_name__icontains=search_value) | Q(registration_number__icontains=search_value)
    ).values("id")

    query_ids = individual_ids.union(company_ids)

    # get active leases for the superuser
    base_lease_queryset = Lease.objects.filter(
        lease_giver=data.company_id,
        reg_ID_Number__in=query_ids,
    )
    
    # Apply color filter if provided
    if color_filter:
        if color_filter == "black":
            new_status = 'NON-PAYER'
        elif color_filter == "orange":
            new_status = 'MEDIUM'
        elif "#991b1b" in color_filter:
            new_status = 'HIGH-HIGH'
        elif color_filter == "#f87171":
            new_status = 'HIGH'
        else:
            new_status = 'SAFE'
        base_lease_queryset = base_lease_queryset.filter(status_cache=new_status)
    paginator = Paginator(base_lease_queryset.order_by("created_date"), items_per_page)
    leases = paginator.get_page(page_number)

    lease_dict = {}
    
    for i in leases:
        opening_balance_date = Opening_balance.objects.filter(lease_id=i.lease_id).first()
        name, trading_name, mobile, email = "", "", "N/A", "N/A"
        company_id, individual_id = None, None
        
        # Determine lease color based on status_cache
        if i.status_cache == "NON-PAYER":
            color = "black"
        elif i.status_cache == "HIGH-HIGH":
            color = "danger"
        elif i.status_cache == "HIGH":
            color = "light-red"
        elif i.status_cache == "MEDIUM":
            color = "warning"
        else:
            color = "success"

        if i.is_company:
            if company_ob := Company.objects.filter(id=i.reg_ID_Number).first():
                name, trading_name = company_ob.registration_name, company_ob.trading_name
                if company_profile := CompanyProfile.objects.filter(company=company_ob.id).first():
                    mobile, email = company_profile.mobile_phone or "N/A", company_profile.email or "N/A"
                    company_id = company_ob.id
        else:
            if individual_ob := Individual.objects.filter(national_id=i.reg_ID_Number.upper()).first():
                name = f"{individual_ob.firstname} {individual_ob.surname}"
                mobile = individual_ob.mobile
                individual_id = individual_ob.id

        lease_payment_detail = LeasePayments.objects.filter(lease_id=i.lease_id).last()
        opening_balance_amount = Opening_balance.objects.filter(lease_id=i.lease_id).last()
        owing_amount = float(opening_balance_amount.outstanding_balance) if opening_balance_amount else 0

        agent_info = Landlord.objects.filter(lease_id=i.lease_id).first()
        hundred_days_ago = date.today() - timedelta(days=100)
        is_100_days_ago = True if i.termination_date and i.termination_date < hundred_days_ago else False
        is_terminated_lease_eligible = True if (i.is_active == False and owing_amount <= 0 or is_100_days_ago)  else False
        
        if i.lease_id not in lease_dict and not is_terminated_lease_eligible:
            lease_dict[i.lease_id] = {
                "id": individual_id if i.is_individual else company_id,
                "name": name,
                "trading_name": trading_name,
                "address": i.address,
                "email": email,
                "mobile": mobile,
                "customer_number": i.account_number,
                "lease_id": i.lease_id,
                "reg_ID_Number": i.reg_ID_Number,
                "is_company": i.is_company,
                "lease_details": i.lease_details,
                "deposit_amount": i.deposit_amount,
                "deposit_period": i.deposit_period,
                "monthly_rentals": round(float(i.monthly_rentals), 2),
                "owing_amount": round(owing_amount, 2),
                "currency": i.currency,
                "opening_balance_date": opening_balance_date.date_created.date() if opening_balance_date else None,
                "agent_reg_number": agent_info.reg_ID_Number if agent_info else "N/A",
                "agent_name": agent_info.landlord_name if agent_info else "N/A",
                "agent_id": agent_info.landlord_id if agent_info else "N/A",
                "commission_amount": agent_info.agent_commission if agent_info else "N/A",
                "agent_opening_balance": agent_info.opening_balance if agent_info else "N/A",
                "rent_variable": i.rent_variables,
                "status": i.status,
                "terminated": True if i.is_active == False else False,
                "color": color,
                "start_date": i.start_date,
                "end_date": i.end_date,
                "payment_period_start": i.payment_period_start,
                "payment_period_end": i.payment_period_end,
            }

    return list(lease_dict.values())


def individual_report(request, data):

    try:
        individual_ob = Individual.objects.get(identification_number=data.national_id)
    except:
        individual_ob = None
    individual_details = risk_data = score_range = credit_details = (
        historical_credit_accounts
    ) = {}
  
    historic_claims_list = historic_claims(individual_ob.identification_number)
    

    is_eligible = True
    require_otp = False
    if individual_ob.mobile:
        mobile = individual_ob.mobile
        request_user_company = Company.objects.filter(
            id=data.company_id
        ).first()
        name = request_user_company.trading_name if request_user_company else "N/A"
        message = f"Accept Credit Check on CrediSafe from {name} ? Give OTP below as confirmation."
       
        is_eligible = True
        if employment_detail := EmployementDetails.objects.filter(
            individual=individual_ob.id
        ).first():
            job_title = employment_detail.job_title
            employer_name = employment_detail.employer_name
            date_of_employment = employment_detail.date_of_employment
            marital_status = employment_detail.marital_status
        else:
            job_title = employer_name = date_of_employment = marital_status = ""

        national_id = individual_ob.identification_number
        firstname = individual_ob.firstname
        surname = individual_ob.surname
        mobile = individual_ob.mobile
        landline=individual_ob.land_line
        dob = individual_ob.dob
        gender = individual_ob.gender
        address = individual_ob.address
        email = individual_ob.email
        individual_details = {
            "national_id": national_id,
            "firstname": firstname,
            "surname": surname,
            "mobile": mobile,
            "landline":landline,
            "dob": dob,
            "gender": gender,
            "marital_status": marital_status,
            "email": email,
            "address": address,
            "job_title": job_title,
            "employer_name": employer_name,
            "date_of_employment": date_of_employment,
        }
        color, score, level, score_level = check_credit_score(request, national_id)
        risk_data = {
            "class": f"{level}",
            "color": f"{color}",
            "score": score,
        }  # low, medium, high
        score_range = {
            "class": f"{score_level}",  # Low Low Risk [LLR], Low Medium Risk [LMR], Low High Risk [LHR],High Low Risk [HLR], High Medium Risk [HMR], High High Risk [HHR]
            "index_range": score,
        }

    leases_list = active_credit_accounts(individual_ob.identification_number)
    credit_details = leases_list


    return credit_details, historic_claims_list, risk_data , score_range# in arears
           
def company_report(request, data):
    is_internal = Company.objects.filter(id=data.company_id).first()
    internal = is_internal.registration_name.lower() == "fincheck"
    require_otp = False
    is_eligible = True
    enquired_date = date.today()
    first_day_of_month = date(enquired_date.year, enquired_date.month, 1)
    _, last_day = calendar.monthrange(enquired_date.year, enquired_date.month)
    last_day_of_month = date(enquired_date.year, enquired_date.month, last_day)
    try:
        company_ob = Company.objects.get(id=data.search_value)
    except Exception:
        company_ob = None
    company_details, risk_data, score_range, historical_credit_accounts = {}, {}, {}, {}

    historic_claims_list = historic_claims(company_ob.id)
    print("===============ddd====", historic_claims_list)

    if company_ob:
        registration_name = company_ob.registration_name
        registration_number = company_ob.registration_number
        trading_name = company_ob.trading_name
        industry = company_ob.industry

       
        # Credit Type	Currency	Start Date	End Date	Principal Amount	Instalment Amount	Overdue Amount
        leases_list = active_credit_accounts(company_ob.id)
        color, score, level, score_level = check_credit_score(request, company_ob.id)
        risk_data = {
            "class": f"{level}",
            "color": f"{color}",
            "score": score,
        }  # low, medium, high
        score_range = {
            "class": f"{score_level}",  # Low Low Risk [LLR], Low Medium Risk [LMR], Low High Risk [LHR],High Low Risk [HLR], High Medium Risk [HMR], High High Risk [HHR]
            "index_range": score,
        }
        credit_details = leases_list

   
    return  credit_details,historic_claims_list,risk_data, score_range
