#webhook
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
        payload = json.loads(request.body)
        ref = payload.get("ref")
        logger.info("Webhook payload ref: %s", ref)
        
        if ref != "refs/heads/rentsafe-backend":
            logger.info("Ignoring ref: %s", ref)
            return JsonResponse({"status": "ignored", "ref": ref})
        
        # Use the mounted host directory
        subprocess.run(['chmod', '+x', './deploy_rentsafe.sh'], check=True)
        subprocess.run(['git', 'config', '--global', '--add', 'safe.directory', '/var/www/credisafe/rentsafe-api/rentsafe'], check=True)
        result = subprocess.run(
            ['./deploy_rentsafe.sh'],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        logger.info("Deploy script completed successfully")
        logger.info("Script output: %s", result.stdout)
        
        return JsonResponse({
            "status": "success", 
            "output": result.stdout
        }, status=200)
        
    except subprocess.CalledProcessError as e:
        logger.error("Deploy script failed: %s", str(e))
        logger.error("STDERR: %s", e.stderr)
        logger.error("STDOUT: %s", e.stdout)
        return JsonResponse({
            "error": "Deployment failed", 
            "stderr": e.stderr,
            "stdout": e.stdout
        }, status=500)
        
    except subprocess.TimeoutExpired:
        logger.error("Deploy script timed out")
        return JsonResponse({"error": "Deployment timed out"}, status=500)
        
    except Exception as e:
        logger.exception("Unexpected error in webhook")
        return JsonResponse({"error": str(e)}, status=500)