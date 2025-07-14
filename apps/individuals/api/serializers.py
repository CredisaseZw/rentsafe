from rest_framework import serializers
from apps.common.models.models import Address
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin
from apps.common.api.serializers import AddressSerializer, NoteSerializer, DocumentSerializer
from django.contrib.contenttypes.models import ContentType

class EmploymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetail
        fields = [
            'id', 'employer_name', 'job_title', 
            'start_date', 'end_date', 'is_current',
            'monthly_income', 'marital_status'
        ]

class NextOfKinSerializer(serializers.ModelSerializer):
    relationship_display = serializers.CharField(
        source='get_relationship_display',
        read_only=True
    )
    
    class Meta:
        model = NextOfKin
        fields = [
            'id', 'first_name', 'last_name',
            'relationship', 'relationship_display',
            'mobile_phone', 'email', 'physical_address'
        ]

class IndividualSerializer(serializers.ModelSerializer):
    employment_details = EmploymentDetailSerializer(many=True,required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    gender_display = serializers.CharField(source='get_gender_display',read_only=True)
    identification_type_display = serializers.CharField(source='get_identification_type_display',read_only=True)
    addresses = AddressSerializer(many=True,required=False)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number', 'email', 'mobile_phone',
            'landline_phone', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin', 'documents', 
            'addresses', 'notes','date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']
    
   
    def validate(self, data):
    # Custom validation  for uniquieness of identification_number
        if 'identification_number' in data:
            identification_number = data['identification_number']
            query = Individual.objects.filter(identification_number__iexact=identification_number)
            if self.instance: # Exclude current instance for updates
                query = query.exclude(pk=self.instance.pk)
            if query.exists():
                raise serializers.ValidationError(
                    {"identification_number": "An individual with this identification number already exists."}
                )
        return data

    def create(self, validated_data):
        
        employment_details_data = validated_data.pop('employment_details', [])
        next_of_kin_data = validated_data.pop('next_of_kin', [])
        address_data = validated_data.pop('addresses', [])
        notes_data = validated_data.pop('notes', [])
        documents_data = validated_data.pop('documents',[])

        individual = Individual.objects.create(**validated_data)
        
        content_type_individual = ContentType.objects.get_for_model(Individual)
        

        if notes_data:
            for note in notes_data:
                notes_serializer = NoteSerializer(data=note,context={
                    'content_type': content_type_individual, 
                    'object_id': individual.pk
                })
                notes_serializer.is_valid(raise_exception=True)
                notes_serializer.save()
                
        if documents_data:
            for doc in documents_data:
                doc_serializer = DocumentSerializer(data=doc, context={
                    'content_type': content_type_individual,
                    'object_id': individual.pk
                })
                doc_serializer.is_valid(raise_exception=True)
                doc_serializer.save()
                
        # if address_data:
        for address in address_data:
            address_serializer = AddressSerializer(data=address, context={
                'content_type': content_type_individual,
                'object_id': individual.pk
            })
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()
            
        # Create employment details and next of kin
        if employment_details_data:
            for employment_detail in employment_details_data:
                employment_detail_serializer = EmploymentDetailSerializer(data=employment_detail)
                employment_detail_serializer.is_valid(raise_exception=True)
                employment_detail_serializer.save(individual=individual)

        if next_of_kin_data:
            for kin in next_of_kin_data:
                kin_serializer = NextOfKinSerializer(data=kin)
                kin_serializer.is_valid(raise_exception=True)
                kin_serializer.save(individual=individual)
  
        return individual
                
    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        next_of_kin_data = validated_data.pop('next_of_kin', [])
        employment_details_data = validated_data.pop('employment_details', [])
        notes_data = validated_data.pop('notes', [])

        print("Helooo world___-----___111")

        for field, value in validated_data.items():
            setattr(instance, field, value)
            
        if addresses_data is not None:
            instance.addresses.clear()
            for address in addresses_data:
                Address.objects.create(content_object=instance, **address)

        for note in notes_data:
            NoteSerializer.objects.update_or_create(
                individual=instance,
                content_type=ContentType.objects.get_for_model(instance),
            )

        for employment_detail in employment_details_data:
            EmploymentDetail.objects.update_or_create(
                individual=instance,
                **employment_detail
            )

        for kin in next_of_kin_data:
            NextOfKin.objects.update_or_create(
                individual=instance,
                **kin
            )
        instance.save()

        return instance