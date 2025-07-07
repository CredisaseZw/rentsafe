# users/management/commands/seed_roles.py

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from users.models import Role # Ensure this import matches your app name

class Command(BaseCommand):
    help = 'Seeds initial roles and assigns relevant permissions for the property management system.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting roles seeding...'))

        roles_data = [
            {
                'name': 'Admin',
                'description': 'Full administrative access to the entire system.',
                'permissions': '__ALL__', # Special keyword to grant all existing permissions
            },
            {
                'name': 'Superintendent',
                'description': 'Oversees building operations and maintenance, often with limited system access.',
                'permissions': [
                    'maintenance.add_maintenancerequest',
                    'maintenance.change_maintenancerequest',
                    'maintenance.view_maintenancerequest',
                    'maintenance.view_servicevendor', # To contact vendors
                    'properties.view_property',
                    'properties.view_unit',
                    'communications.add_message',
                    'communications.view_message',
                ]
            },
            {
                'name': 'Accountant',
                'description': 'Manages all financial aspects, including invoices, payments, bank reconciliations, and financial reports.',
                'permissions': [
                    # Accounting Module
                    'accounting.add_chartofaccounts', 'accounting.change_chartofaccounts', 'accounting.delete_chartofaccounts', 'accounting.view_chartofaccounts',
                    'accounting.add_journalentry', 'accounting.change_journalentry', 'accounting.delete_journalentry', 'accounting.view_journalentry',
                    'accounting.add_bankreconciliation', 'accounting.change_bankreconciliation', 'accounting.delete_bankreconciliation', 'accounting.view_bankreconciliation',
                    'accounting.add_currency', 'accounting.change_currency', 'accounting.delete_currency', 'accounting.view_currency',
                    'accounting.add_budget', 'accounting.change_budget', 'accounting.delete_budget', 'accounting.view_budget',
                    # Payments Module
                    'payments.add_payment', 'payments.change_payment', 'payments.delete_payment', 'payments.view_payment',
                    'payments.add_invoice', 'payments.change_invoice', 'payments.delete_invoice', 'payments.view_invoice',
                    'payments.add_transaction', 'payments.change_transaction', 'payments.delete_transaction', 'payments.view_transaction',
                    
                    # View-only access for context
                    'leases.view_lease',
                    'companies.view_company', # For vendor/landlord billing details
                    'individuals.view_individual', # For tenant payment details
                ]
            },
            {
                'name': 'Property Manager',
                'description': 'Oversees property operations, including leases, tenants, maintenance, and basic financials.',
                'permissions': [
                    # Properties & Units Module
                    'properties.add_property', 'properties.change_property', 'properties.delete_property', 'properties.view_property',
                    'properties.add_unit', 'properties.change_unit', 'properties.delete_unit', 'properties.view_unit',

                    # Leases Module
                    'leases.add_lease', 'leases.change_lease', 'leases.delete_lease', 'leases.view_lease',
                    'leases.add_rentalapplication', 'leases.change_rentalapplication', 'leases.delete_rentalapplication', 'leases.view_rentalapplication',

                    # Individuals (Tenants, Applicants) & Companies (Landlords, Vendors) Module
                    'individuals.add_individual', 'individuals.change_individual', 'individuals.delete_individual', 'individuals.view_individual',
                    'companies.add_company', 'companies.change_company', 'companies.delete_company', 'companies.view_company',

                    # Payments Module (Limited - for recording/viewing rent, not full accounting)
                    'payments.add_payment', 'payments.change_payment', 'payments.view_payment',
                    'payments.view_invoice', # Can view invoices, but not full accounting details

                    # Maintenance Module
                    'maintenance.add_maintenancerequest', 'maintenance.change_maintenancerequest', 'maintenance.delete_maintenancerequest', 'maintenance.view_maintenancerequest',
                    'maintenance.add_servicevendor', 'maintenance.change_servicevendor', 'maintenance.delete_servicevendor', 'maintenance.view_servicevendor',

                    # Communications & Documents Modules
                    'communications.add_message', 'communications.change_message', 'communications.view_message',
                    'documents.add_document', 'documents.change_document', 'documents.delete_document', 'documents.view_document',

                    # User management (view only, to see linked tenants/landlords)
                    'users.view_customuser',
                ]
            },
            {
                'name': 'Lease Administrator',
                'description': 'Specializes in lease agreements, renewals, and tenant applications.',
                'permissions': [
                    'leases.add_lease', 'leases.change_lease', 'leases.delete_lease', 'leases.view_lease',
                    'leases.add_rentalapplication', 'leases.change_rentalapplication', 'leases.delete_rentalapplication', 'leases.view_rentalapplication',
                    
                    'individuals.add_individual', 'individuals.change_individual', 'individuals.view_individual', # For applicant/tenant data
                    
                    'properties.view_property', 'properties.view_unit', # To check property details for leases
                    
                    'documents.add_document', 'documents.change_document', 'documents.delete_document', 'documents.view_document', # For lease documents
                    
                    'communications.add_message', 'communications.view_message', # For communicating with applicants/tenants
                ]
            },
            {
                'name': 'Maintenance Coordinator',
                'description': 'Manages maintenance requests, assigns tasks to vendors, and tracks progress.',
                'permissions': [
                    'maintenance.add_maintenancerequest', 'maintenance.change_maintenancerequest', 'maintenance.delete_maintenancerequest', 'maintenance.view_maintenancerequest',
                    'maintenance.add_servicevendor', 'maintenance.change_servicevendor', 'maintenance.delete_servicevendor', 'maintenance.view_servicevendor',
                    
                    'properties.view_property', 'properties.view_unit', # To locate properties for maintenance
                    
                    'individuals.view_individual', # To see tenant contact info for maintenance
                    
                    'communications.add_message', 'communications.change_message', 'communications.view_message',
                ]
            },
            {
                'name': 'Tenant',
                'description': 'For system users who are tenants. Can view their own property/lease details, make payments, and submit maintenance requests.',
                'permissions': [
                    'properties.view_property', # Needs object-level permission in views to restrict to *their* property
                    'leases.view_lease', # Needs object-level permission in views to restrict to *their* lease
                    'payments.add_payment', 'payments.view_payment', # Add payment, view their own payments (needs object-level)
                    'maintenance.add_maintenancerequest', 'maintenance.view_maintenancerequest', # Submit, view their own (needs object-level)
                    'documents.view_document', # View documents related to their lease (needs object-level)
                    'users.change_customuser', 'users.view_customuser', # To update their own profile (password, profile picture)
                    'communications.add_message', 'communications.view_message', # For communicating with management
                ]
            },
            {
                'name': 'Agent', # Or 'Leasing Agent'
                'description': 'Manages property listings, interacts with prospective tenants, and handles leads.',
                'permissions': [
                    'listings.add_listing', 'listings.change_listing', 'listings.delete_listing', 'listings.view_listing',
                    'leads.add_lead', 'leads.change_lead', 'leads.delete_lead', 'leads.view_lead',
                    
                    'properties.view_property', 'properties.view_unit', # To show properties to leads
                    
                    'leases.add_rentalapplication', 'leases.change_rentalapplication', 'leases.view_rentalapplication', # To process applications
                    
                    'individuals.add_individual', 'individuals.change_individual', 'individuals.view_individual', # For new leads/applicants
                    
                    'communications.add_message', 'communications.change_message', 'communications.view_message',
                    'marketing.add_campaign', 'marketing.change_campaign', 'marketing.view_campaign', # If you have a marketing app
                ]
            },
            {
                'name': 'Analytics Manager',
                'description': 'Has comprehensive access to all data for reporting and analytical purposes.',
                'permissions': [
                    # Permissions specific to a 'reports' app or custom report access
                    'reports.view_report', # General view report permission (if you have a Report model)
                    # Custom permissions for specific report types:
                    # 'reports.can_view_financial_reports',
                    # 'reports.can_view_operational_reports',
                    # 'reports.can_view_marketing_reports',

                    # View access to ALL underlying data required for comprehensive reporting
                    'properties.view_property', 'properties.view_unit',
                    'leases.view_lease', 'leases.view_rentalapplication',
                    'payments.view_payment', 'payments.view_invoice', 'payments.view_transaction',
                    'maintenance.view_maintenancerequest', 'maintenance.view_servicevendor',
                    'accounting.view_chartofaccounts', 'accounting.view_journalentry', 'accounting.view_bankreconciliation', 'accounting.view_budget',
                    'individuals.view_individual',
                    'companies.view_company',
                    'users.view_customuser',
                    'listings.view_listing',
                    'leads.view_lead',
                    'communications.view_message',
                    'documents.view_document',
                    'marketing.view_campaign',
                ]
            },
            {
                'name': 'Executive',
                'description': 'High-level oversight; typically view-only access to all critical business data and reports.',
                'permissions': [
                    # Similar to Analytics Manager, but perhaps without "add/change/delete" permissions for core data
                    # This role mostly relies on "view" permissions and custom report permissions
                    'properties.view_property', 'properties.view_unit',
                    'leases.view_lease', 'leases.view_rentalapplication',
                    'payments.view_payment', 'payments.view_invoice', 'payments.view_transaction',
                    'maintenance.view_maintenancerequest', 'maintenance.view_servicevendor',
                    'accounting.view_chartofaccounts', 'accounting.view_journalentry', 'accounting.view_bankreconciliation', 'accounting.view_budget',
                    'individuals.view_individual',
                    'companies.view_company',
                    'users.view_customuser',
                    'listings.view_listing',
                    'leads.view_lead',
                    'communications.view_message',
                    'documents.view_document',
                    'marketing.view_campaign',
                    # Add any specific 'can_view_dashboard' or high-level report permissions here
                    # 'reports.can_view_executive_dashboard'
                ]
            },
            {
                'name': 'Vendor',
                'description': 'Limited access for service vendors to view assigned maintenance tasks and update status.',
                'permissions': [
                    'maintenance.view_maintenancerequest', # Needs object-level permission for assigned tasks
                    'maintenance.change_maintenancerequest', # To update status (e.g., 'completed')
                    'communications.add_message', 'communications.view_message', # To communicate about tasks
                    'documents.view_document', # To view related work orders/schematics (needs object-level)
                ]
            },
            {
                'name': 'Landlord',
                'description': 'Allows property owners to view their property details, financial statements, and tenant information.',
                'permissions': [
                    'properties.view_property', # Needs object-level for their properties
                    'properties.view_unit', # Needs object-level for units in their properties
                    'leases.view_lease', # Needs object-level for leases on their properties
                    'individuals.view_individual', # Needs object-level for tenants on their properties
                    'payments.view_payment', # Needs object-level for payments related to their properties
                    'payments.view_invoice', # Needs object-level for invoices related to their properties
                    'accounting.view_journalentry', # Needs object-level for entries related to their properties (e.g., owner distributions)
                    'maintenance.view_maintenancerequest', # Needs object-level for requests on their properties
                    'documents.view_document', # Needs object-level for owner statements, property docs
                    'reports.view_owner_statement', # Custom permission
                ]
            },
            {
                'name': 'Read-Only User',
                'description': 'Can view most non-sensitive data but cannot make any changes.',
                'permissions': [
                    # This would be a long list, e.g., view_property, view_unit, view_lease, etc. for all relevant models.
                    # Or, you could dynamically get all 'view' permissions. For now, a comprehensive list:
                    'properties.view_property',
                    'properties.view_unit',
                    'leases.view_lease',
                    'leases.view_rentalapplication',
                    'individuals.view_individual',
                    'companies.view_company',
                    'payments.view_payment',
                    'payments.view_invoice',
                    'payments.view_transaction',
                    'accounting.view_chartofaccounts',
                    'accounting.view_journalentry',
                    'accounting.view_bankreconciliation',
                    'accounting.view_budget',
                    'maintenance.view_maintenancerequest',
                    'maintenance.view_servicevendor',
                    'users.view_customuser',
                    'documents.view_document',
                    'listings.view_listing',
                    'leads.view_lead',
                    'communications.view_message',
                    'marketing.view_campaign',
                    'django_admin_log.view_logentry', # Useful for auditing
                ]
            }
        ]

        with transaction.atomic():
            self.stdout.write(self.style.NOTICE('Fetching all existing permissions for validation...'))
            # Pre-fetch all permissions to avoid hitting DB in loop unnecessarily
            all_db_permissions = {
                f"{p.content_type.app_label}.{p.codename}": p
                for p in Permission.objects.select_related('content_type').all()
            }
            
            for role_data in roles_data:
                role_name = role_data['name']
                permissions_to_assign_objects = []

                self.stdout.write(f"\nProcessing role: '{role_name}'")

                if role_data['permissions'] == '__ALL__':
                    permissions_to_assign_objects = list(all_db_permissions.values())
                    self.stdout.write(f"  Role '{role_name}': Assigning ALL {len(permissions_to_assign_objects)} existing permissions.")
                else:
                    for perm_codename in role_data['permissions']:
                        if perm_codename in all_db_permissions:
                            permissions_to_assign_objects.append(all_db_permissions[perm_codename])
                        else:
                            self.stdout.write(self.style.WARNING(
                                f"  Permission '{perm_codename}' does not exist in the database. "
                                f"Skipping for role '{role_name}'. Make sure the app and model are migrated, "
                                f"and custom permissions are defined."
                            ))
                
                role, created = Role.objects.get_or_create(
                    name=role_name,
                    defaults={'description': role_data['description'], 'is_active': True}
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f"  Created role: '{role.name}'"))
                else:
                    self.stdout.write(self.style.WARNING(f"  Role '{role.name}' already exists."))
                    # Optionally, update description if it has changed
                    if role.description != role_data['description']:
                        role.description = role_data['description']
                        role.save()
                        self.stdout.write(f"  Updated description for role '{role.name}'.")

                role.permissions.set(permissions_to_assign_objects)
                self.stdout.write(f"  Assigned {len(permissions_to_assign_objects)} permissions to role '{role.name}'.")

        self.stdout.write(self.style.SUCCESS('\nRoles seeding completed successfully!'))