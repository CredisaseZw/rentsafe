from django.contrib import admin
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, IndividualContactDetail
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse

@admin.register(Individual)
class IndividualAdmin(admin.ModelAdmin):
    list_display = ('id','last_name', 'first_name', 'gender', 'identification_number', 'date_of_birth', 'is_verified','is_active','is_deleted')
    list_display_links = ('last_name', 'first_name','identification_number')
    list_filter = ('gender', 'identification_type', 'is_active', 'is_verified','is_deleted')
    search_fields = ('first_name', 'last_name', 'identification_number')
    ordering = ('last_name', 'first_name')
    
    actions= ['mark_as_verified', 'mark_as_unverified', 'activate_individuals', 'deactivate_individuals']
    
    def mark_as_verified(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} Individual marked as verified.')
    mark_as_verified.short_description = _('Mark selected Individual as verified')
    
    def mark_as_unverified(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} Individual marked as unverified.')
    mark_as_unverified.short_description = _('Mark selected Individual as unverified')
    
    def activate_individuals(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} Individual activated.')
    activate_individuals.short_description = _('Activate selected Individual')
    
    def deactivate_individuals(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} Individual deactivated.')
    deactivate_individuals.short_description = _('Deactivate selected Individual')
    
@admin.register(EmploymentDetail)
class EmploymentDetailAdmin(admin.ModelAdmin):
    list_display = ('individual', 'job_title', 'employer_name', 'start_date', 'end_date','is_current')
    list_display_links = ('individual', 'job_title')
    list_filter = ('individual', 'is_current')
    search_fields = ('individual__first_name', 'individual__last_name', 'job_title', 'employer_name')
    ordering = ('-start_date', 'individual__last_name')
  
@admin.register(NextOfKin)
class NextOfKinAdmin(admin.ModelAdmin):
    list_display = ('individual', 'first_name', 'last_name','mobile_phone','email', 'relationship','physical_address')
    list_display_links = ('individual', 'first_name', 'last_name')
    list_filter = ('relationship',)
    ordering = ('last_name', 'first_name')

@admin.register(IndividualContactDetail)
class IndividualContactDetailAdmin(admin.ModelAdmin):
    list_display = ('id','individual', 'email', 'mobile_phone')
    list_display_links = ('individual',)
    search_fields = ('individual__first_name', 'individual__last_name', 'email')