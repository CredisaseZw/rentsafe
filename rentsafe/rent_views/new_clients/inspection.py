from django.shortcuts import render, redirect
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.http import JsonResponse

def save_inspection_document(request):
    if request.method == "POST" and request.FILES.get("inspection_pdf"):
        uploaded_file = request.FILES["inspection_pdf"]

        folder = "Inspection_docs/"
        file_name = uploaded_file.name+ "_" +str(request.user.company)
        file_path = os.path.join(folder, uploaded_file.name)
        saved_path = default_storage.save(file_path, ContentFile(uploaded_file.read()))

        file_url = default_storage.url(saved_path)

        print(f"File saved at: {file_url}")

        return JsonResponse({"status": "success", "file_url": file_url})

    return JsonResponse({"status": "failed", "message": "No file uploaded."})
