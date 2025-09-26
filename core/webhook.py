import subprocess
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import hmac
import hashlib
import json

@csrf_exempt
def github_webhook(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    secret = settings.GITHUB_WEBHOOK_SECRET.encode()
    signature = request.headers.get('X-Hub-Signature-256')
    if secret and signature:
        hash = hmac.new(secret, request.body, hashlib.sha256).hexdigest()
        expected_signature = f"sha256={hash}"
        if not hmac.compare_digest(signature, expected_signature):
            return HttpResponseForbidden("Invalid signature")
    
    payload = json.loads(request.body)
    ref = payload.get("ref")

    if ref != "refs/heads/rentsafe-backend":
        return JsonResponse({"status": "ignored", "ref": ref})
    
    # Run deploy script on the HOST system
    try:
        # Use full path to the script on the host
        script_path = "/var/www/credisafe/rentsafe-api/rentsafe/deploy_rentsafe.sh"
        
        # Execute with proper permissions
        result = subprocess.run(
            ["/bin/bash", script_path],
            cwd="/var/www/credisafe/rentsafe-api/rentsafe",
            check=True,
            capture_output=True,
            text=True
        )
        return JsonResponse({"status": "success", "output": result.stdout})
    except subprocess.CalledProcessError as e:
        return JsonResponse({"error": str(e), "stderr": e.stderr}, status=500)
    except FileNotFoundError as e:
        return JsonResponse({"error": "Deploy script not found"}, status=500)