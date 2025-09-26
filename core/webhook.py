import subprocess
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import hmac
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def github_webhook(request):
    logger.info("GitHub webhook received")
    
    if request.method != "POST":
        logger.error("Invalid method: %s", request.method)
        return JsonResponse({"error": "Invalid method"}, status=405)

    # Verify secret if set
    if hasattr(settings, 'GITHUB_WEBHOOK_SECRET') and settings.GITHUB_WEBHOOK_SECRET:
        secret = settings.GITHUB_WEBHOOK_SECRET.encode()
        signature = request.headers.get('X-Hub-Signature-256')
        
        if not signature:
            logger.error("Missing signature header")
            return HttpResponseForbidden("Missing signature")
        
        hash = hmac.new(secret, request.body, hashlib.sha256).hexdigest()
        expected_signature = f"sha256={hash}"
        if not hmac.compare_digest(signature, expected_signature):
            logger.error("Invalid signature")
            return HttpResponseForbidden("Invalid signature")
    try:
        script_path = "/var/www/credisafe/rentsafe-api/rentsafe/deploy_rentsafe.sh"
        working_dir = "/var/www/credisafe/rentsafe-api/rentsafe"
        
        logger.info("Executing deploy script as ubuntu user: %s", script_path)
        
        # Execute as ubuntu user with proper environment
        result = subprocess.run(
            ["sudo", "-u", "ubuntu", "/bin/bash", script_path],
            cwd=working_dir,
            check=True,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        logger.info("Deploy script completed successfully")
        return JsonResponse({"status": "success", "output": result.stdout})
        
    except subprocess.CalledProcessError as e:
        logger.error("Deploy script failed: %s", str(e))
        return JsonResponse({
            "error": "Deployment failed", 
            "stderr": e.stderr,
            "stdout": e.stdout
        }, status=500)
    except Exception as e:
        logger.exception("Unexpected error in webhook")
        return JsonResponse({"error": str(e)}, status=500)