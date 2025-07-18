from django.contrib import admin
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, IndividualContactDetail

@admin.register(Individual)
class IndividualAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'gender', 'identification_number', 'date_of_birth')
    list_display_links = ('last_name', 'first_name','identification_number')
    list_filter = ('gender', 'identification_type', 'is_active', 'is_verified')
    search_fields = ('first_name', 'last_name', 'identification_number')
    ordering = ('last_name', 'first_name')
    
@admin.register(EmploymentDetail)
class EmploymentDetailAdmin(admin.ModelAdmin):
    list_display = ('individual', 'job_title', 'employer_name', 'start_date', 'end_date')
    list_display_links = ('individual', 'job_title')
    list_filter = ('individual', 'is_current')
    search_fields = ('individual__first_name', 'individual__last_name', 'job_title', 'employer_name')
    ordering = ('-start_date', 'individual__last_name')
  
@admin.register(NextOfKin)
class NextOfKinAdmin(admin.ModelAdmin):
    list_display = ('individual', 'first_name', 'last_name', 'relationship')
    list_display_links = ('individual', 'first_name', 'last_name')
    list_filter = ('relationship',)
    ordering = ('last_name', 'first_name')

@admin.refgister(IndividualContactDetail)
class IndividualContactDetailAdmin(admin.ModelAdmin):
    list_display = ('individual', 'email', 'mobile_phone')
    list_display_links = ('individual',)
    search_fields = ('individual__first_name', 'individual__last_name', 'email')
    ordering = ('individual__last_name', 'individual__first_name')