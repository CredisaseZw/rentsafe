import os
import requests
import json
from github import Github, GithubException
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO_OWNER = os.getenv("GITHUB_REPO_OWNER")
GITHUB_REPO_NAME = os.getenv("GITHUB_REPO_NAME")
GITHUB_PROJECT_NUMBER = 2  
GITHUB_ORG_NAME = "CredisaseZw" 

SIZE_OPTIONS = {
    "XS": "XS",
    "S": "S",
    "M": "M",
    "L": "L",
    "XL": "XL"
}

PRIORITY_OPTIONS = {
    "P0: Critical": "P0",
    "P1: High": "P1",
    "P2: Medium": "P2"
}

PROJECT_DEFAULT_STATUS = "Todo" 

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

MILESTONES = {
    "Sprint 1: Core Setup": "Focus on foundational models and basic CRUD for core apps.",
    "Sprint 2: Key Features": "Implement primary business logic and initial integrations.",
    "Sprint 3: Integrations & Refinement": "Complete external integrations, refine existing features, and improve testing.",
}

ISSUE_TEMPLATES = {
    "users": [
        {"title": "Implement User Model (CustomUser)", "body": "Ensure CustomUser model is fully defined with all necessary fields and methods, including manager for superuser creation. Add basic validation.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:users"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Setup User Authentication Endpoints", "body": "Create API endpoints for user registration, login (JWT), password reset, and profile management.", "priority": "P0: Critical", "size": "L", "labels": ["feature", "app:users", "api"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement User Roles and Permissions", "body": "Define roles (e.g., Admin, Agent, Tenant) and integrate Django permissions system with CustomUser.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:users"], "milestone": "Sprint 2: Key Features"},
        {"title": "Write Unit Tests for User App", "body": "Develop comprehensive unit tests for models, views, and serializers in the users app.", "priority": "P1: High", "size": "L", "labels": ["refactor", "app:users", "tests"], "milestone": "Sprint 2: Key Features"},
    ],
    "clients": [
        {"title": "Define Client Model", "body": "Create the Client model with fields for client details and linkage to CustomUser. Ensure all necessary fields and relationships are defined.", "priority": "P0: Critical", "size": "S", "labels": ["feature", "app:clients"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Client CRUD API", "body": "Implement API endpoints for creating, reading, updating, and deleting Client records (serializers, views, URLs).", "priority": "P1: High", "size": "M", "labels": ["feature", "app:clients", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Client into Admin Panel", "body": "Register Client model in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "size": "XS", "labels": ["enhancement", "app:clients", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "companies": [
        {"title": "Define Company and CompanyBranch Models", "body": "Create models for Company and CompanyBranch with relevant fields and relationships (e.g., address, contact info).", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:companies"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement ContactPerson Model and Constraints", "body": "Ensure ContactPerson model is correctly defined with relationships (to Individual, CompanyBranch) and unique constraints (e.g., primary contact per branch).", "priority": "P0: Critical", "size": "S", "labels": ["feature", "app:companies"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Company/Branch/ContactPerson CRUD API", "body": "Create API endpoints for managing companies, branches, and their contact persons.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:companies", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Add Admin Interface for Companies and Contacts", "body": "Register Company, CompanyBranch, and ContactPerson in Django admin with inline forms where appropriate.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:companies", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "individuals": [
        {"title": "Define Individual Model", "body": "Create the Individual model with personal details, and relationships to EmploymentDetail and NextOfKin models.", "priority": "P0: Critical", "size": "S", "labels": ["feature", "app:individuals"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Individual CRUD API", "body": "Develop API endpoints for creating, reading, updating, and deleting individual records.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:individuals", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Individual into Admin Panel", "body": "Register Individual model in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "size": "XS", "labels": ["enhancement", "app:individuals", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "common": [
        {"title": "Review BaseModel and GenericForeignKey Usage", "body": "Ensure BaseModel is robust and GenericForeignKey is used correctly across all models, addressing any lingering validation issues.", "priority": "P1: High", "size": "M", "labels": ["refactor", "app:common"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Location Models (Country, Province, City, Suburb)", "body": "Ensure full CRUD and search for location data. Consider pre-populating with common data.", "priority": "P0: Critical", "size": "L", "labels": ["feature", "app:common", "api"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Develop Document and Note Management (Generic)", "body": "Create models and API for generic documents and notes that can attach to any model via GFK. Include admin integration.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:common", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "properties": [
        {"title": "Define Property and Unit Models", "body": "Create models for properties and their units, including types, amenities, and addresses.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:properties"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Property/Unit CRUD API", "body": "Develop API endpoints for managing properties and units (serializers, views, URLs).", "priority": "P1: High", "size": "L", "labels": ["feature", "app:properties", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Add Property Management to Admin", "body": "Register Property and Unit models in Django admin with appropriate list display, filters, and search fields.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:properties", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "leases": [
        {"title": "Define Lease and LeaseCharge Models", "body": "Create models for lease agreements, lease charges, lease tenants, and lease logs. Establish relationships to Property/Unit and Individual/Company.", "priority": "P0: Critical", "size": "L", "labels": ["feature", "app:leases"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Lease Management API", "body": "Develop API endpoints for creating, managing, and terminating leases. Include logic for calculating rent, charges, and payment schedules.", "priority": "P1: High", "size": "XL", "labels": ["feature", "app:leases", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Lease Admin", "body": "Register Lease models in Django admin with custom actions and detailed views.", "priority": "P2: Medium", "size": "M", "labels": ["enhancement", "app:leases", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "accounting": [
        {"title": "Define Currency and PaymentMethod Models", "body": "Ensure core accounting models like Currency and PaymentMethod are well-defined. Consider internationalization for currencies.", "priority": "P0: Critical", "size": "S", "labels": ["feature", "app:accounting"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Transaction and Invoice Models", "body": "Develop models for financial transactions (e.g., payments, expenses) and invoicing. Link to leases and other relevant entities.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:accounting"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Accounting API Endpoints", "body": "Create APIs for managing financial records, including transaction logging and invoice generation.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:accounting", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "communications": [
        {"title": "Implement Communication Log Model", "body": "Create a generic model for logging various communication types (email, SMS, WhatsApp) linked to relevant entities.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:communications"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Email/SMS/WhatsApp Sending", "body": "Develop utilities and API endpoints for sending notifications via different channels (Twilio, custom email service).", "priority": "P1: High", "size": "L", "labels": ["feature", "app:communications", "integration"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Notification Templates", "body": "Create a system for managing reusable email, SMS, and WhatsApp message templates.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:communications"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "reporting": [
        {"title": "Define ReportTemplate and GeneratedReport Models", "body": "Create models for report templates (e.g., lease, financial) and instances of generated reports.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:reporting"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Report Generation Logic", "body": "Develop backend logic for generating various types of reports based on templates and parameters.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:reporting"], "milestone": "Sprint 2: Key Features"},
        {"title": "Develop Reporting API", "body": "Create API endpoints for managing report templates and triggering report generation.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:reporting", "api"], "milestone": "Sprint 2: Key Features"},
    ],
    "maintenance": [
        {"title": "Define MaintenanceRequest and WorkSchedule Models", "body": "Create models for tracking property maintenance requests, their status, and associated work schedules.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:maintenance"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Maintenance Management API", "body": "Develop API endpoints for creating, updating, and tracking maintenance requests and work schedules.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:maintenance", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Maintenance Admin", "body": "Register Maintenance models in Django admin for easy management by administrators.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:maintenance", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "subscriptions": [
        {"title": "Define Subscription and SubscriptionPeriod Models", "body": "Create models for managing user subscriptions, including plans, periods, and associated services.", "priority": "P0: Critical", "size": "S", "labels": ["feature", "app:subscriptions"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Subscription Management API", "body": "Develop API endpoints for creating, activating, renewing, and managing subscriptions.", "priority": "P1: High", "size": "M", "labels": ["feature", "app:subscriptions", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Subscription Admin", "body": "Register Subscription models in Django admin for easy oversight.", "priority": "P2: Medium", "size": "XS", "labels": ["enhancement", "app:subscriptions", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "credit_control": [
        {"title": "Define DebtCase and PaymentPlan Models", "body": "Create models for managing debt cases, payment plans, and communication logs related to credit control.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:credit_control"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Debt Collection API", "body": "Develop API endpoints for managing debt cases, tracking payments, and logging communications.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:credit_control", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Credit Control Admin", "body": "Register Credit Control models in Django admin for managing debt cases.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:credit_control", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
    "legal": [
        {"title": "Define Contract and ContractAmendment Models", "body": "Create models for legal contracts (e.g., rental agreements) and their amendments. Link to relevant entities like leases or properties.", "priority": "P0: Critical", "size": "M", "labels": ["feature", "app:legal"], "milestone": "Sprint 1: Core Setup"},
        {"title": "Implement Contract Management API", "body": "Develop API endpoints for creating, managing, and retrieving legal contracts and amendments.", "priority": "P1: High", "size": "L", "labels": ["feature", "app:legal", "api"], "milestone": "Sprint 2: Key Features"},
        {"title": "Integrate Legal Admin", "body": "Register Legal models in Django admin.", "priority": "P2: Medium", "size": "S", "labels": ["enhancement", "app:legal", "admin"], "milestone": "Sprint 3: Integrations & Refinement"},
    ],
}

def run_graphql_query(query, variables=None):
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json",
    }
    
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    
    response = requests.post(
        "https://api.github.com/graphql",
        headers=headers,
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"GraphQL query failed: {response.status_code} - {response.text}")

def get_github_repo_and_github_instance():
    if not GITHUB_TOKEN or not GITHUB_REPO_OWNER or not GITHUB_REPO_NAME:
        print("Error: GitHub environment variables (GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME) are not set.")
        return None, None

    try:
        g = Github(GITHUB_TOKEN)
        user = g.get_user(GITHUB_REPO_OWNER)
        repo = user.get_repo(GITHUB_REPO_NAME)
        print(f"Connected to GitHub repository: {GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}")
        return repo, g
    except GithubException as e:
        print(f"Error connecting to GitHub: {e}")
        print("Please check your GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME.")
        return None, None

def get_github_project_v2():
    print(f"\nSearching for Project (V2): 'Rentsafe Development' (Number: {GITHUB_PROJECT_NUMBER})...")

    query = """
    query($org: String!, $projectNumber: Int!) {
        organization(login: $org) {
            projectV2(number: $projectNumber) {
                id
                title
                number
                fields(first: 20) {
                    nodes {
                        ... on ProjectV2Field {
                            id
                            name
                            dataType
                        }
                        ... on ProjectV2IterationField {
                            id
                            name
                            dataType
                        }
                        ... on ProjectV2SingleSelectField {
                            id
                            name
                            dataType
                            options {
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }
    """

    variables = {
        "org": GITHUB_ORG_NAME,
        "projectNumber": GITHUB_PROJECT_NUMBER
    }

    try:
        result = run_graphql_query(query, variables)
        project = result.get("data", {}).get("organization", {}).get("projectV2")
        
        if project:
            print(f"  Found project: '{project.get('title')}' (ID: {project.get('id')})")
            return project
        else:
            print("  Warning: Project not found. Issues will not be linked to a project.")
            return None

    except Exception as e:
        print(f"  Error fetching Project V2: {e}")
        return None

def get_project_fields(project_v2_obj):
    fields = {
        "priority": None,
        "size": None,
        "status": None,
        "priority_options": {},
        "size_options": {},
        "status_options": {}
    }
    
    if not project_v2_obj or "fields" not in project_v2_obj or not project_v2_obj["fields"].get("nodes"):
        print("DEBUG: Project V2 object or its fields are malformed or empty.")
        return fields
    
    for field in project_v2_obj["fields"]["nodes"]:
        if not isinstance(field, dict):
            print(f"DEBUG: Encountered non-dictionary field in project_v2_obj['fields']['nodes']: {field} (type: {type(field)})")
            continue 

        field_name = field.get("name", "").lower() 
        
        if field_name == "priority":
            fields["priority"] = field.get("id")
            if field.get("options"): 
                fields["priority_options"] = {opt.get("name"): opt.get("id") for opt in field["options"] if isinstance(opt, dict) and opt.get("name") and opt.get("id")}
        elif field_name == "size":
            fields["size"] = field.get("id")
            if field.get("options"): 
                fields["size_options"] = {opt.get("name"): opt.get("id") for opt in field["options"] if isinstance(opt, dict) and opt.get("name") and opt.get("id")}
        elif field_name == "status":
            fields["status"] = field.get("id")
            if field.get("options"): 
                fields["status_options"] = {opt.get("name"): opt.get("id") for opt in field["options"] if isinstance(opt, dict) and opt.get("name") and opt.get("id")}
    
    print(f"DEBUG: Extracted project fields: {fields}")
    return fields

def add_issue_to_project(project_id, issue_id, fields, priority=None, size=None, status=None):
    mutation = """
    mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
            item {
                id
            }
        }
    }
    """

    variables = {
        "projectId": project_id,
        "contentId": issue_id
    }

    try:
        result = run_graphql_query(mutation, variables)
        item_id = result.get("data", {}).get("addProjectV2ItemById", {}).get("item", {}).get("id")

        if not item_id:
            print(f"Error: Could not get item ID after adding issue {issue_id} to project {project_id}. Result: {result}")
            return None

        # Update Priority Field
        if priority and fields.get("priority"):
            priority_option_id = fields["priority_options"].get(PRIORITY_OPTIONS.get(priority, ""))
            if priority_option_id:
                try:
                    update_mutation = """
                    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
                        updateProjectV2ItemFieldValue(
                            input: {
                                projectId: $projectId
                                itemId: $itemId
                                fieldId: $fieldId
                                value: $value
                            }
                        ) {
                            projectV2Item { id }
                        }
                    }
                    """
                    update_variables = {
                        "projectId": project_id,
                        "itemId": item_id,
                        "fieldId": fields["priority"],
                        "value": {"singleSelectOptionId": priority_option_id}
                    }
                    run_graphql_query(update_mutation, update_variables)
                    print(f"    Updated Priority to '{priority}' for item {item_id}.")
                except Exception as e:
                    print(f"    Error updating Priority for item {item_id}: {e}")
            else:
                print(f"    Warning: Priority option '{priority}' not found in project fields for item {item_id}.")

        # Update Size Field
        if size and fields.get("size"):
            size_option_id = fields["size_options"].get(size)
            if size_option_id:
                try:
                    update_mutation = """
                    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
                        updateProjectV2ItemFieldValue(
                            input: {
                                projectId: $projectId
                                itemId: $itemId
                                fieldId: $fieldId
                                value: $value
                            }
                        ) {
                            projectV2Item { id }
                        }
                    }
                    """
                    update_variables = {
                        "projectId": project_id,
                        "itemId": item_id,
                        "fieldId": fields["size"],
                        "value": {"singleSelectOptionId": size_option_id}
                    }
                    run_graphql_query(update_mutation, update_variables)
                    print(f"    Updated Size to '{size}' for item {item_id}.")
                except Exception as e:
                    print(f"    Error updating Size for item {item_id}: {e}")
            else:
                print(f"    Warning: Size option '{size}' not found in project fields for item {item_id}.")

        # Update Status Field (To Do)
        if status and fields.get("status"):
            status_option_id = fields["status_options"].get(status)
            if status_option_id:
                try:
                    update_mutation = """
                    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
                        updateProjectV2ItemFieldValue(
                            input: {
                                projectId: $projectId
                                itemId: $itemId
                                fieldId: $fieldId
                                value: $value
                            }
                        ) {
                            projectV2Item { id }
                        }
                    }
                    """
                    update_variables = {
                        "projectId": project_id,
                        "itemId": item_id,
                        "fieldId": fields["status"],
                        "value": {"singleSelectOptionId": status_option_id}
                    }
                    run_graphql_query(update_mutation, update_variables)
                    print(f"    Updated Status to '{status}' for item {item_id}.")
                except Exception as e:
                    print(f"    Error updating Status for item {item_id}: {e}")
            else:
                print(f"    Warning: Status option '{status}' not found in project fields for item {item_id}.")

        return item_id

    except Exception as e:
        print(f"Error adding item to project: {e}")
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

def create_issues(repo, milestones, project_v2_obj=None):
    print("\nCreating issues...")
    existing_issues = {issue.title for issue in repo.get_issues(state='open')}
    
    project_fields = {}
    if project_v2_obj:
        project_fields = get_project_fields(project_v2_obj)
        print(f"  Project fields: Priority ID={project_fields.get('priority')}, Size ID={project_fields.get('size')}, Status ID={project_fields.get('status')}")

    for app_name in DJANGO_APPS:
        print(f"\nProcessing issues for app: {app_name}")
        app_issues = ISSUE_TEMPLATES.get(app_name, [])
        
        for issue_data in app_issues:
            title = issue_data["title"]
            body = issue_data["body"]
            priority = issue_data.get("priority")
            size = issue_data.get("size")
            labels = issue_data["labels"] + [priority] if priority in issue_data else issue_data["labels"]
            milestone_title = issue_data.get("milestone")
            
            if title in existing_issues:
                print(f"  Issue '{title}' already exists. Skipping.")
                continue

            issue_labels = []
            for label_name in labels:
                try:
                    issue_labels.append(repo.get_label(label_name))
                except GithubException as e:
                    print(f"  Warning: Label '{label_name}' not found for issue '{title}'. Error: {e}")
            
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

                if project_v2_obj:
                    if issue_node_id := get_issue_node_id(issue.number):
                        add_issue_to_project(
                            project_v2_obj["id"],
                            issue_node_id,
                            project_fields,
                            priority=priority,
                            size=size,
                            status=PROJECT_DEFAULT_STATUS 
                        )
                        print(f"    Linked issue #{issue.number} to project with priority '{priority}', size '{size}', and status '{PROJECT_DEFAULT_STATUS}'")
                    else:
                        print(f"    Could not get node_id for issue #{issue.number}")
            except GithubException as e:
                print(f"  Error creating issue '{title}': {e}")

def get_issue_node_id(issue_number):
    query = """
    query($owner: String!, $repo: String!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
            issue(number: $issueNumber) {
                id
            }
        }
    }
    """
    
    variables = {
        "owner": GITHUB_REPO_OWNER,
        "repo": GITHUB_REPO_NAME,
        "issueNumber": issue_number
    }
    
    try:
        result = run_graphql_query(query, variables)
        return result["data"]["repository"]["issue"]["id"]
    except Exception as e:
        print(f"Error getting node_id for issue #{issue_number}: {e}")
        return None

def link_unlinked_issues_to_project(repo, project_v2_obj):
    if not project_v2_obj:
        print("\nSkipping linking existing issues: Project (V2) object not found.")
        return

    print(f"\nAttempting to link existing issues to project '{project_v2_obj['title']}'...")

    expected_issue_titles = set()
    for app_name in DJANGO_APPS:
        for issue_data in ISSUE_TEMPLATES.get(app_name, []):
            expected_issue_titles.add(issue_data["title"])

    all_repo_issues = {issue.title: issue for issue in repo.get_issues(state='open')}

    project_fields = get_project_fields(project_v2_obj)

    query = """
    query($projectId: ID!) {
        node(id: $projectId) {
            ... on ProjectV2 {
                items(first: 100) {
                    nodes {
                        content {
                            ... on Issue {
                                number
                            }
                        }
                    }
                }
            }
        }
    }
    """

    try:
        result = run_graphql_query(query, {"projectId": project_v2_obj["id"]})
        existing_project_issues = set()
        if "data" in result and result["data"].get("node") and result["data"]["node"].get("items") and result["data"]["node"]["items"].get("nodes"):
            for item in result["data"]["node"]["items"]["nodes"]:
                if item.get("content") and item["content"].get("number"):
                    existing_project_issues.add(item["content"]["number"])
    except Exception as e:
        print(f"  Error fetching existing project items: {e}")
        existing_project_issues = set()

    for title in expected_issue_titles:
        if title in all_repo_issues:
            issue = all_repo_issues[title]
            # if issue.number in existing_project_issues:
            #     print(f"  Issue #{issue.number} - '{issue.title}' is already linked to the project. Skipping.")
            if issue_node_id := get_issue_node_id(issue.number):
                priority = None
                size = None
                for app_name in DJANGO_APPS:
                    for issue_data in ISSUE_TEMPLATES.get(app_name, []):
                        if issue_data["title"] == title:
                            priority = issue_data.get("priority")
                            size = issue_data.get("size")
                            break
                
                add_issue_to_project(
                    project_v2_obj["id"],
                    issue_node_id,
                    project_fields,
                    priority=priority,
                    size=size,
                    status=PROJECT_DEFAULT_STATUS 
                )
                print(f"  Linked existing issue #{issue.number} - '{issue.title}' to project with priority '{priority}', size '{size}', and status '{PROJECT_DEFAULT_STATUS}'")
            else:
                print(f"  Could not get node_id for issue #{issue.number}")
        else:
            print(f"  Expected issue '{title}' not found in repository. Skipping linking.")
            
if __name__ == "__main__":
    repo, g_instance = get_github_repo_and_github_instance()
    if repo and g_instance:
        ensure_labels(repo)
        milestones = ensure_milestones(repo)
        
        project_v2_obj = get_github_project_v2()

        create_issues(repo, milestones, project_v2_obj=project_v2_obj)
        link_unlinked_issues_to_project(repo, project_v2_obj)
    print("\nScript finished.")
