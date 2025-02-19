import csv
import os
from django.http import HttpResponse, HttpResponseNotFound

def download_template(request, template_name: str):
  """
  View function to serve the requested CSV template.
  """
  template_path = os.path.join('data_upload', 'templates', template_name)

  if os.path.exists(template_path):
    with open(template_path, 'r') as template_file:
      reader = csv.reader(template_file)
      # Assuming your template has headers, include them in the response
      headers = next(reader)
      response = HttpResponse(content_type='text/csv')
      response.write(csv.writer(response).writerows([headers] + list(reader)))
      response['Content-Disposition'] = f'attachment; filename="{template_name}"'
      if template_name.startswith('invalid_individual_data'):
        os.remove(template_path)
      return response
  else:
    # Handle case where template doesn't exist
    return HttpResponseNotFound('Template not found')
