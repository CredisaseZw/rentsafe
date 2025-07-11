# apps/companies/api/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.contenttypes.models import ContentType
from apps.companies.models.models import Company, CompanyBranch, ContactPerson, CompanyProfile
from apps.common.models.models import Address, Document, Note
from apps.individuals.api.serializers import IndividualSerializer 
from apps.common.api.serializers import AddressSerializer, DocumentSerializer, NoteSerializer
from apps.individuals.models.models import Individual

# Company App Serializers
class CompanyBranchSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False) # Nested serializer for generic relation
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True
    )
    company_name = serializers.CharField(source='company.registration_name', read_only=True)

    class Meta:
        model = CompanyBranch
        fields = [
            'id', 'company_id', 'company_name', 'branch_name', 'addresses',
            'date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']
        validators = [
            UniqueTogetherValidator(
                queryset=CompanyBranch.objects.all(),
                fields=['company', 'branch_name'],
                message="A branch with this name already exists for this company."
            )
        ]

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        branch = CompanyBranch.objects.create(**validated_data)
        for address_data in addresses_data:
            address_serializer = AddressSerializer(data=address_data, context={
                'content_type': ContentType.objects.get_for_model(branch),
                'object_id': branch.id
            })
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()
        return branch

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        instance = super().update(instance, validated_data)

        # Handle nested updates for addresses
        existing_address_ids = {addr.id for addr in instance.addresses.all()}
        updated_address_ids = set()

        for address_data in addresses_data:
            address_id = address_data.get('id')
            if address_id:
                # Update existing address
                try:
                    address_instance = instance.addresses.get(id=address_id)
                    address_serializer = AddressSerializer(
                        address_instance, data=address_data, partial=True, context={
                            'content_type': ContentType.objects.get_for_model(instance),
                            'object_id': instance.id
                        }
                    )
                    address_serializer.is_valid(raise_exception=True)
                    address_serializer.save()
                    updated_address_ids.add(address_id)
                except Address.DoesNotExist:
                    # If an ID is provided but doesn't exist for this branch, treat as new
                    address_serializer = AddressSerializer(data=address_data, context={
                        'content_type': ContentType.objects.get_for_model(instance),
                        'object_id': instance.id
                    })
                    address_serializer.is_valid(raise_exception=True)
                    address_serializer.save()
                    updated_address_ids.add(address_serializer.instance.id)
            else:
                # Create new address
                address_serializer = AddressSerializer(data=address_data, context={
                    'content_type': ContentType.objects.get_for_model(instance),
                    'object_id': instance.id
                })
                address_serializer.is_valid(raise_exception=True)
                address_serializer.save()
                updated_address_ids.add(address_serializer.instance.id)

        # Delete addresses not included in the update data
        addresses_to_delete = existing_address_ids - updated_address_ids
        Address.objects.filter(id__in=list(addresses_to_delete)).delete()

        return instance


class ContactPersonSerializer(serializers.ModelSerializer):
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=CompanyBranch.objects.all(), source='branch', write_only=True, allow_null=True, required=False
    )
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    individual = IndividualSerializer(required=False, allow_null=True) # Nested serializer for Individual
    individual_id = serializers.PrimaryKeyRelatedField(
        queryset=Individual.objects.all(), source='individual', write_only=True, allow_null=True, required=False
    )
    contact_type_display = serializers.CharField(source='get_contact_type_display', read_only=True)

    class Meta:
        model = ContactPerson
        fields = [
            'id', 'branch_id', 'branch_name', 'individual', 'individual_id', 'contact_type',
            'contact_type_display', 'is_primary', 'position', 'date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']
        validators = [
            UniqueTogetherValidator(
                queryset=ContactPerson.objects.all(),
                fields=['branch', 'contact_type'],
                # The condition for 'primary' contact type is handled by the model's constraint.
                # DRF's UniqueTogetherValidator does not support conditional uniqueness directly.
                # The model's constraint 'unique_primary_branch_contact' will still apply.
                message="Only one primary contact person is allowed per branch."
            )
        ]

    def validate(self, data):
        # Additional validation for contact_type and is_primary
        if data.get('is_primary') and data.get('contact_type') != 'primary':
            raise serializers.ValidationError(
                {"is_primary": "If 'is_primary' is true, 'contact_type' must be 'primary'."}
            )
        # The model's constraint 'unique_primary_branch_contact' handles the uniqueness
        # of a primary contact for a branch.
        return data

    def create(self, validated_data):
        individual_data = validated_data.pop('individual', None)
        if individual_data:
            # If individual data is provided, create or update individual
            individual_serializer = IndividualSerializer(data=individual_data)
            individual_serializer.is_valid(raise_exception=True)
            individual_instance = individual_serializer.save()
            validated_data['individual'] = individual_instance
        return super().create(validated_data)

    def update(self, instance, validated_data):
        individual_data = validated_data.pop('individual', None)
        if individual_data:
            individual_instance = instance.individual
            if individual_instance:
                # Update existing individual
                individual_serializer = IndividualSerializer(individual_instance, data=individual_data, partial=True)
            else:
                # Create new individual if it was null
                individual_serializer = IndividualSerializer(data=individual_data)
            individual_serializer.is_valid(raise_exception=True)
            individual_serializer.save()

        return super().update(instance, validated_data)


class CompanyProfileSerializer(serializers.ModelSerializer):
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True
    )
    company_name = serializers.CharField(source='company.registration_name', read_only=True)
    former_address = serializers.SerializerMethodField() # Changed to SerializerMethodField for specific filtering
    postal_address = serializers.SerializerMethodField() # Changed to SerializerMethodField for specific filtering
    contact_person = ContactPersonSerializer(required=False, allow_null=True)
    contact_person_id = serializers.PrimaryKeyRelatedField(
        queryset=ContactPerson.objects.all(), source='contact_person', write_only=True, allow_null=True, required=False
    )
    trading_status_display = serializers.CharField(source='get_trading_status_display', read_only=True)
    trend_display = serializers.CharField(source='get_trend_display', read_only=True)
    risk_class_display = serializers.CharField(source='get_risk_class_display', read_only=True)
    is_under_judicial_display = serializers.CharField(source='get_is_under_judicial_display', read_only=True)

    class Meta:
        model = CompanyProfile
        fields = [
            'company_id', 'company_name', 'trading_status', 'trading_status_display', 'former_address',
            'postal_address', 'mobile_phone', 'landline_phone', 'email', 'logo', 'registration_date',
            'bp_number','vat_number', 'number_of_employees', 'website',
            'trend', 'trend_display', 'twitter', 'facebook', 'instagram', 'linkedin', 'operations',
            'contact_person', 'contact_person_id', 'risk_class', 'risk_class_display',
            'account_number', 'is_under_judicial', 'is_under_judicial_display', 'is_suspended',
            'date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

    def get_former_address(self, obj):
        # Filter addresses specifically for former (physical) type
        addresses = obj.addresses.filter(address_type='physical')
        return AddressSerializer(addresses, many=True, context=self.context).data

    def get_postal_address(self, obj):
        # Filter addresses specifically for postal type
        addresses = obj.addresses.filter(address_type='postal')
        return AddressSerializer(addresses, many=True, context=self.context).data

    def create(self, validated_data):
        # Pop these as they will be handled in the update method after profile creation
        former_address_data = self.context['request'].data.pop('former_address', [])
        postal_address_data = self.context['request'].data.pop('postal_address', [])
        contact_person_data = validated_data.pop('contact_person', None)

        profile = CompanyProfile.objects.create(**validated_data)

        # Handle nested creation for contact_person if provided
        if contact_person_data:
            contact_person_serializer = ContactPersonSerializer(data=contact_person_data, context=self.context)
            contact_person_serializer.is_valid(raise_exception=True)
            profile.contact_person = contact_person_serializer.save()
            profile.save()

        # Create generic related addresses
        content_type_profile = ContentType.objects.get_for_model(profile)

        for addr_data in former_address_data:
            addr_data['address_type'] = 'physical' # Assuming former address implies physical
            address_serializer = AddressSerializer(data=addr_data, context={
                'content_type': content_type_profile,
                'object_id': profile.pk
            })
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        for addr_data in postal_address_data:
            addr_data['address_type'] = 'postal'
            address_serializer = AddressSerializer(data=addr_data, context={
                'content_type': content_type_profile,
                'object_id': profile.pk
            })
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        return profile

    def update(self, instance, validated_data):
        # Pop these as they will be handled by the helper function
        former_address_data = self.context['request'].data.pop('former_address', [])
        postal_address_data = self.context['request'].data.pop('postal_address', [])
        contact_person_data = validated_data.pop('contact_person', None)

        # Update contact person if data is provided
        if contact_person_data:
            contact_person_instance = instance.contact_person
            if contact_person_instance:
                contact_person_serializer = ContactPersonSerializer(contact_person_instance, data=contact_person_data, partial=True, context=self.context)
            else:
                contact_person_serializer = ContactPersonSerializer(data=contact_person_data, context=self.context)
            contact_person_serializer.is_valid(raise_exception=True)
            instance.contact_person = contact_person_serializer.save()

        instance = super().update(instance, validated_data)

        # Update generic related addresses (former_address and postal_address)
        content_type_profile = ContentType.objects.get_for_model(instance)

        # Helper to update/create addresses for a given type
        def update_addresses(address_list, address_type):
            existing_addresses_qs = instance.addresses.filter(address_type=address_type)
            existing_address_ids = {addr.id for addr in existing_addresses_qs}
            updated_address_ids = set()

            for addr_data in address_list:
                addr_id = addr_data.get('id')
                if addr_id:
                    try:
                        addr_instance = existing_addresses_qs.get(id=addr_id)
                        address_serializer = AddressSerializer(
                            addr_instance, data=addr_data, partial=True, context={
                                'content_type': content_type_profile,
                                'object_id': instance.pk
                            }
                        )
                        address_serializer.is_valid(raise_exception=True)
                        address_serializer.save()
                        updated_address_ids.add(addr_id)
                    except Address.DoesNotExist:
                        # If ID exists but not for this profile/type, treat as new
                        addr_data['address_type'] = address_type
                        address_serializer = AddressSerializer(data=addr_data, context={
                            'content_type': content_type_profile,
                            'object_id': instance.pk
                        })
                        address_serializer.is_valid(raise_exception=True)
                        address_serializer.save()
                        updated_address_ids.add(address_serializer.instance.id) # Add newly created ID
                else:
                    # Create new address
                    addr_data['address_type'] = address_type
                    address_serializer = AddressSerializer(data=addr_data, context={
                        'content_type': content_type_profile,
                        'object_id': instance.pk
                    })
                    address_serializer.is_valid(raise_exception=True)
                    address_serializer.save()
                    updated_address_ids.add(address_serializer.instance.id)

            # Delete addresses that were not in the updated list
            addresses_to_delete = existing_address_ids - updated_address_ids
            Address.objects.filter(id__in=list(addresses_to_delete)).delete()

        update_addresses(former_address_data, 'physical')
        update_addresses(postal_address_data, 'postal')

        return instance


class CompanySerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    notes = NoteSerializer(many=True, required=False)
    branches = CompanyBranchSerializer(many=True, read_only=True) # Read-only, handled via separate endpoint
    profile = CompanyProfileSerializer(required=False, allow_null=True) # Nested serializer for one-to-one relationship
    legal_status_display = serializers.CharField(source='get_legal_status_display', read_only=True)

    class Meta:
        model = Company
        fields = [
            'id', 'registration_number', 'registration_name', 'trading_name', 'legal_status', 'legal_status_display',
            'date_of_incorporation', 'industry', 'is_verified', 'is_active', 'is_deleted',
            'addresses', 'documents', 'notes', 'branches', 'profile',
            'date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

    def validate(self, data):
        # Custom validation for unique_registration_name_company constraint
        if 'registration_name' in data:
            registration_name = data['registration_name']
            query = Company.objects.filter(registration_name__iexact=registration_name)
            if self.instance: # Exclude current instance for updates
                query = query.exclude(pk=self.instance.pk)
            if query.exists():
                raise serializers.ValidationError(
                    {"registration_name": "A company with this registration name already exists."}
                )
        return data

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        documents_data = validated_data.pop('documents', [])
        notes_data = validated_data.pop('notes', [])
        profile_data = validated_data.pop('profile', None)

        company = Company.objects.create(**validated_data)

        content_type_company = ContentType.objects.get_for_model(company)

        # Create generic related instances
        for address_data in addresses_data:
            address_serializer = AddressSerializer(data=address_data, context={
                'content_type': content_type_company,
                'object_id': company.pk
            })
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        for document_data in documents_data:
            document_serializer = DocumentSerializer(data=document_data, context={
                'content_type': content_type_company,
                'object_id': company.pk
            })
            document_serializer.is_valid(raise_exception=True)
            document_serializer.save()

        for note_data in notes_data:
            note_serializer = NoteSerializer(data=note_data, context={
                'content_type': content_type_company,
                'object_id': company.pk,
                'request': self.context.get('request') # Pass request for author
            })
            note_serializer.is_valid(raise_exception=True)
            note_serializer.save()

        # Create CompanyProfile if provided
        if profile_data:
            # Pass the full request context to the profile serializer
            profile_serializer = CompanyProfileSerializer(data={**profile_data, 'company_id': company.pk}, context=self.context)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()
            company.profile = profile_serializer.instance # Link the created profile

        # Automatically create HQ branch
        company.auto_create_hq_branch()

        return company

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        documents_data = validated_data.pop('documents', [])
        notes_data = validated_data.pop('notes', [])
        profile_data = validated_data.pop('profile', None)

        # Update basic company fields
        instance = super().update(instance, validated_data)

        content_type_company = ContentType.objects.get_for_model(instance)

        # Helper to update/create generic related objects
        def update_generic_relation(data_list, serializer_class, instance_manager):
            existing_ids = {obj.id for obj in instance_manager.all()}
            updated_ids = set()

            for item_data in data_list:
                item_id = item_data.get('id')
                if item_id:
                    try:
                        item_instance = instance_manager.get(id=item_id)
                        serializer = serializer_class(
                            item_instance, data=item_data, partial=True, context={
                                'content_type': content_type_company,
                                'object_id': instance.pk,
                                'request': self.context.get('request') # Pass request for NoteSerializer
                            }
                        )
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        updated_ids.add(item_id)
                    except (Address.DoesNotExist, Document.DoesNotExist, Note.DoesNotExist):
                        # If ID exists but not for this company, treat as new
                        serializer = serializer_class(data=item_data, context={
                            'content_type': content_type_company,
                            'object_id': instance.pk,
                            'request': self.context.get('request')
                        })
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        updated_ids.add(serializer.instance.id)
                else:
                    # Create new
                    serializer = serializer_class(data=item_data, context={
                        'content_type': content_type_company,
                        'object_id': instance.pk,
                        'request': self.context.get('request')
                    })
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    updated_ids.add(serializer.instance.id)

            # Delete items not included in the updated list
            items_to_delete = existing_ids - updated_ids
            instance_manager.filter(id__in=list(items_to_delete)).delete()

        update_generic_relation(addresses_data, AddressSerializer, instance.addresses)
        update_generic_relation(documents_data, DocumentSerializer, instance.documents)
        update_generic_relation(notes_data, NoteSerializer, instance.notes)

        # Update CompanyProfile if provided
        if profile_data:
            if instance.profile:
                # Pass the full request context to the profile serializer
                profile_serializer = CompanyProfileSerializer(instance.profile, data=profile_data, partial=True, context=self.context)
            else:
                # Pass the full request context to the profile serializer
                profile_serializer = CompanyProfileSerializer(data={**profile_data, 'company_id': instance.pk}, context=self.context)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        return instance


class CompanyKeyDataSerializer(serializers.ModelSerializer):
    """
    Serializer for returning key data about a company.
    """
    primary_address = serializers.SerializerMethodField()
    primary_contact_person = serializers.SerializerMethodField()
    # Assuming 'profile' is already preloaded in the queryset for efficiency
    # If not, you might need to adjust the queryset in the viewset.

    class Meta:
        model = Company
        fields = [
            'id', 'registration_name', 'trading_name', 'industry', 'is_verified',
            'primary_address', 'primary_contact_person'
        ]

    def get_primary_address(self, obj):
        # Assuming 'physical' and 'is_primary' define the main address for the company
        primary_address = obj.addresses.filter(address_type='physical', is_primary=True).first()
        if primary_address:
            # Return a simplified representation of the address
            return {
                'street_address': primary_address.street_address,
                'city': primary_address.city.name if primary_address.city else None,
                'province': primary_address.province.name if primary_address.province else None,
                'country': primary_address.country.name if primary_address.country else None,
            }
        return None

    def get_primary_contact_person(self, obj):
        # Assuming the CompanyProfile has a primary contact person
        if hasattr(obj, 'profile') and obj.profile and obj.profile.contact_person:
            contact = obj.profile.contact_person
            individual = contact.individual
            if individual:
                return {
                    'name': f"{individual.first_name} {individual.last_name}",
                    'position': contact.position,
                    'email': individual.email,
                    'phone_number': individual.phone_number
                }
        return None


class BranchSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for returning key data about a company branch for search results.
    Returns not more than 5 important key data points.
    """
    company_name = serializers.CharField(source='company.registration_name', read_only=True)
    company_trading_name = serializers.CharField(source='company.trading_name', read_only=True)
    primary_address = serializers.SerializerMethodField()

    class Meta:
        model = CompanyBranch
        fields = [
            'id', 'branch_name', 'company_name', 'company_trading_name',
            'primary_address'
        ]

    def get_primary_address(self, obj):
        # Assuming 'physical' and 'is_primary' define the main address for the branch
        primary_address = obj.addresses.filter(address_type='physical', is_primary=True).first()
        if primary_address:
            return {
                'street_address': primary_address.street_address,
                'city': primary_address.city.name if primary_address.city else None,
                'province': primary_address.province.name if primary_address.province else None,
            }
        return None

