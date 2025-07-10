import os
from github import Github, GithubException
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO_OWNER = os.getenv("GITHUB_REPO_OWNER")
GITHUB_REPO_NAME = os.getenv("GITHUB_REPO_NAME")

DJANGO_APPS = [
    "users",
    "common",
    "individuals",
    "companies",
    "properties",
    "leases",
    "accounting",
    "communications",
    "reporting",
    "maintenance",
    "subscriptions",
    "credit_control",
    "legal",
    "clients",
]

STANDARD_LABELS = {
    "bug": "d73a4a",          
    "enhancement": "a2eeef",  
    "feature": "a2eeef",      
    "documentation": "0075ca",
    "refactor": "ededed",     
    "api": "ededed",          
    "admin": "ededed",        
    "tests": "ededed",        
    "integration": "ededed",  
    "P0: Critical": "b60205", 
    "P1: High": "f9a03f",     
    "P2: Medium": "fcfc03",   
}

# milestones
MILESTONES = {
    "Sprint 1: Core Setup": "Focus on foundational models and basic CRUD for core apps.",
    "Sprint 2: Key Features": "Implement primary business logic and initial integrations.",
    "Sprint 3: Integrations & Refinement": "Complete external integrations, refine existing features, and improve testing.",
}

#issue templates
ISSUE_TEMPLATES = {
    "users": [
        {"title": "Implement User Model (CustomUser)", "body": "Ensure CustomUser model is fully defined with all necessary fields and methods, including manager for superuser creation. Add basic validation.", "priority": "P0: Critical", "labels": ["feature", "app:users"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Setup User Authentication Endpoints", "body": "Create API endpoints for user registration, login (JWT), password reset, and profile management.", "priority": "P0: Critical", "labels": ["feature", "app:users", "api"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement User Roles and Permissions", "body": "Define roles (e.g., Admin, Agent, Tenant) and integrate Django permissions system with CustomUser.", "priority": "P1: High", "labels": ["feature", "app:users"], "milestone": "Sprint 2: Key Features"},
        {"title": "Write Unit Tests for User App", "body": "Develop comprehensive unit tests for models, views, and serializers in the users app.", "priority": "P1: High", "labels": ["refactor", "app:users", "tests"], "milestone": "Sprint 2: Key Features"},
    ],
    "clients": [
        {"title": "Define Client Model", "body": "Create the Client model with fields for client details and linkage to CustomUser. Ensure all necessary fields and relationships are defined.", "priority": "P0: Critical", "labels": ["feature", "app:clients"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Client CRUD API", "body": "Implement API endpoints for creating, reading, updating, and deleting Client records (serializers, views, URLs).", "priority": "P1: High", "labels": ["feature", "app:clients", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Client into Admin Panel", "body": "Register Client model in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "labels": ["enhancement", "app:clients", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "companies": [
        {"title": "Define Company and CompanyBranch Models", "body": "Create models for Company and CompanyBranch with relevant fields and relationships (e.g., address, contact info).", "priority": "P0: Critical", "labels": ["feature", "app:companies"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement ContactPerson Model and Constraints", "body": "Ensure ContactPerson model is correctly defined with relationships (to Individual, CompanyBranch) and unique constraints (e.g., primary contact per branch).", "priority": "P0: Critical", "labels": ["feature", "app:companies"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Company/Branch/ContactPerson CRUD API", "body": "Create API endpoints for managing companies, branches, and their contact persons.", "priority": "P1: High", "labels": ["feature", "app:companies", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Add Admin Interface for Companies and Contacts", "body": "Register Company, CompanyBranch, and ContactPerson in Django admin with inline forms where appropriate.", "priority": "P2: Medium", "labels": ["enhancement", "app:companies", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "individuals": [
        {"title": "Define Individual Model", "body": "Create the Individual model with personal details, and relationships to EmploymentDetail and NextOfKin models.", "priority": "P0: Critical", "labels": ["feature", "app:individuals"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Individual CRUD API", "body": "Develop API endpoints for creating, reading, updating, and deleting individual records.", "priority": "P1: High", "labels": ["feature", "app:individuals", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Individual into Admin Panel", "body": "Register Individual model in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "labels": ["enhancement", "app:individuals", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "common": [
        {"title": "Review BaseModel and GenericForeignKey Usage", "body": "Ensure BaseModel is robust and GenericForeignKey is used correctly across all models, addressing any lingering validation issues.", "priority": "P1: High", "labels": ["refactor", "app:common"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Location Models (Country, Province, City, Suburb)", "body": "Ensure full CRUD and search for location data. Consider pre-populating with common data.", "priority": "P0: Critical", "labels": ["feature", "app:common", "api"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Document and Note Management (Generic)", "body": "Create models and API for generic documents and notes that can attach to any model via GFK. Include admin integration.", "priority": "P1: High", "labels": ["feature", "app:common", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "properties": [
        {"title": "Define Property and Unit Models", "body": "Create models for properties and their units, including types, amenities, and addresses.", "priority": "P0: Critical", "labels": ["feature", "app:properties"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Property/Unit CRUD API", "body": "Develop API endpoints for managing properties and units (serializers, views, URLs).", "priority": "P1: High", "labels": ["feature", "app:properties", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Add Property Management to Admin", "body": "Register Property and Unit models in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "labels": ["enhancement", "app:properties", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "leases": [
        {"title": "Define Lease and LeaseCharge Models", "body": "Create models for lease agreements, lease charges, lease tenants, and lease logs. Establish relationships to Property/Unit and Individual/Company.", "priority": "P0: Critical", "labels": ["feature", "app:leases"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Lease Management API", "body": "Develop API endpoints for creating, managing, and terminating leases. Include logic for calculating rent, charges, and payment schedules.", "priority": "P1: High", "labels": ["feature", "app:leases", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Lease Admin", "body": "Register Lease models in Django admin with custom actions and detailed views.", "priority": "P2: Medium", "labels": ["enhancement", "app:leases", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "accounting": [
        {"title": "Define Currency and PaymentMethod Models", "body": "Ensure core accounting models like Currency and PaymentMethod are well-defined. Consider internationalization for currencies.", "priority": "P0: Critical", "labels": ["feature", "app:accounting"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Transaction and Invoice Models", "body": "Develop models for financial transactions (e.g., payments, expenses) and invoicing. Link to leases and other relevant entities.", "priority": "P1: High", "labels": ["feature", "app:accounting"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Accounting API Endpoints", "body": "Create APIs for managing financial records, including transaction logging and invoice generation.", "priority": "P1: High", "labels": ["feature", "app:accounting", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "communications": [
        {"title": "Implement Communication Log Model", "body": "Create a generic model for logging various communication types (email, SMS, WhatsApp) linked to relevant entities.", "priority": "P1: High", "labels": ["feature", "app:communications"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Email/SMS/WhatsApp Sending", "body": "Develop utilities and API endpoints for sending notifications via different channels (Twilio, custom email service).", "priority": "P1: High", "labels": ["feature", "app:communications", "integration"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Notification Templates", "body": "Create a system for managing reusable email, SMS, and WhatsApp message templates.", "priority": "P2: Medium", "labels": ["enhancement", "app:communications"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "reporting": [
        {"title": "Define ReportTemplate and GeneratedReport Models", "body": "Create models for report templates (e.g., lease, financial) and instances of generated reports.", "priority": "P0: Critical", "labels": ["feature", "app:reporting"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Report Generation Logic", "body": "Develop backend logic for generating various types of reports based on templates and parameters.", "priority": "P1: High", "labels": ["feature", "app:reporting"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Reporting API", "body": "Create API endpoints for managing report templates and triggering report generation.", "priority": "P1: High", "labels": ["feature", "app:reporting", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "maintenance": [
        {"title": "Define MaintenanceRequest and WorkSchedule Models", "body": "Create models for tracking property maintenance requests, their status, and associated work schedules.", "priority": "P0: Critical", "labels": ["feature", "app:maintenance"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Maintenance Management API", "body": "Develop API endpoints for creating, updating, and tracking maintenance requests and work schedules.", "priority": "P1: High", "labels": ["feature", "app:maintenance", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Maintenance Admin", "body": "Register Maintenance models in Django admin for easy management by administrators.", "priority": "P2: Medium", "labels": ["enhancement", "app:maintenance", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "subscriptions": [
        {"title": "Define Subscription and SubscriptionPeriod Models", "body": "Create models for managing user subscriptions, including plans, periods, and associated services.", "priority": "P0: Critical", "labels": ["feature", "app:subscriptions"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Subscription Management API", "body": "Develop API endpoints for creating, activating, renewing, and managing subscriptions.", "priority": "P1: High", "labels": ["feature", "app:subscriptions", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Subscription Admin", "body": "Register Subscription models in Django admin for easy oversight.", "priority": "P2: Medium", "labels": ["enhancement", "app:subscriptions", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "credit_control": [
        {"title": "Define DebtCase and PaymentPlan Models", "body": "Create models for managing debt cases, payment plans, and communication logs related to credit control.", "priority": "P0: Critical", "labels": ["feature", "app:credit_control"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Debt Collection API", "body": "Develop API endpoints for managing debt cases, tracking payments, and logging communications.", "priority": "P1: High", "labels": ["feature", "app:credit_control", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Credit Control Admin", "body": "Register Credit Control models in Django admin for managing debt cases.", "priority": "P2: Medium", "labels": ["enhancement", "app:credit_control", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "legal": [
        {"title": "Define Contract and ContractAmendment Models", "body": "Create models for legal contracts (e.g., rental agreements) and their amendments. Link to relevant entities like leases or properties.", "priority": "P0: Critical", "labels": ["feature", "app:legal"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Contract Management API", "body": "Develop API endpoints for creating, managing, and retrieving legal contracts and amendments.", "priority": "P1: High", "labels": ["feature", "app:legal", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Legal Admin", "body": "Register Legal models in Django admin.", "priority": "P2: Medium", "labels": ["enhancement", "app:legal", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
}

def get_github_repo():
    if not GITHUB_TOKEN or not GITHUB_REPO_OWNER or not GITHUB_REPO_NAME:
        print("Error: GitHub environment variables (GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME) are not set.")
        return None

    try:
        g = Github(GITHUB_TOKEN)
        user = g.get_user(GITHUB_REPO_OWNER)
        repo = user.get_repo(GITHUB_REPO_NAME)
        print(f"Connected to GitHub repository: {GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}")
        return repo
    except GithubException as e:
        print(f"Error connecting to GitHub: {e}")
        print("Please check your GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME.")
        return None

def ensure_labels(repo):
    print("\nEnsuring labels exist...")
    existing_labels = {label.name for label in repo.get_labels()}
    
    for label_name, color in STANDARD_LABELS.items():
        if label_name not in existing_labels:
            try:
                repo.create_label(label_name, color)
                print(f"  Created label: {label_name}")
            except GithubException as e:
                print(f"  Error creating label {label_name}: {e}")
        else:
            print(f"  Label '{label_name}' already exists.")
    
    for app_name in DJANGO_APPS:
        app_label_name = f"app:{app_name}"
        if app_label_name not in existing_labels:
            try:
                repo.create_label(app_label_name, "ededed")
                print(f"  Created label: {app_label_name}")
            except GithubException as e:
                print(f"  Error creating label {app_label_name}: {e}")
        else:
            print(f"  Label '{app_label_name}' already exists.")

def ensure_milestones(repo):
    print("\nEnsuring milestones exist...")
    existing_milestones = {milestone.title: milestone for milestone in repo.get_milestones(state='open')}

    for milestone_title, description in MILESTONES.items():
        if milestone_title not in existing_milestones:
            try:
                repo.create_milestone(title=milestone_title, description=description)
                print(f"  Created milestone: {milestone_title}")
            except GithubException as e:
                print(f"  Error creating milestone {milestone_title}: {e}")
        else:
            print(f"  Milestone '{milestone_title}' already exists.")
    return {milestone.title: milestone for milestone in repo.get_milestones(state='open')} 

def create_issues(repo, milestones):
    print("\nCreating issues...")
    existing_issues = {issue.title for issue in repo.get_issues(state='open')}

    for app_name in DJANGO_APPS:
        print(f"\nProcessing issues for app: {app_name}")
        app_issues = ISSUE_TEMPLATES.get(app_name, [])
        
        for issue_data in app_issues:
            title = issue_data["title"]
            body = issue_data["body"]
            priority_label = issue_data["priority"]
            labels = issue_data["labels"] + [priority_label] # Add priority as a label
            milestone_title = issue_data.get("milestone")
            
            if title in existing_issues:
                print(f"  Issue '{title}' already exists. Skipping.")
                continue

            # Getting GitHub Label objects
            issue_labels = []
            for label_name in labels:
                try:
                    issue_labels.append(repo.get_label(label_name))
                except GithubException as e:
                    print(f"  Warning: Label '{label_name}' not found for issue '{title}'. Error: {e}")
            
            # Getting GitHub Milestone object
            milestone_obj = None
            if milestone_title and milestone_title in milestones:
                milestone_obj = milestones[milestone_title]
            elif milestone_title:
                print(f"  Warning: Milestone '{milestone_title}' not found for issue '{title}'. Skipping milestone assignment.")

            try:
                issue = repo.create_issue(
                    title=title,
                    body=body,
                    labels=issue_labels,
                    milestone=milestone_obj
                )
                print(f"  Created issue: #{issue.number} - {issue.title}")
            except GithubException as e:
                print(f"  Error creating issue '{title}': {e}")

if __name__ == "__main__":
    repo = get_github_repo()
    if repo:
        ensure_labels(repo)
        milestones = ensure_milestones(repo)
        create_issues(repo, milestones)
    print("\nScript finished.")
