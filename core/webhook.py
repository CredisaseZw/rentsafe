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
        # Parse payload
    payload = json.loads(request.body)
    ref = payload.get("ref")

    if ref != "refs/heads/rentsafe-backend":
        return JsonResponse({"status": "ignored", "ref": ref})
    
    # Run deploy script
    try:
        subprocess.run(
            ["./deploy_rentsafe.sh"],
            check=True
        )
        return JsonResponse({"status": "success"})
    except subprocess.CalledProcessError as e:
        return JsonResponse({"error": str(e)}, status=500)
