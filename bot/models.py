from django.db import models

# Create your models here.
class ChatUserSession(models.Model):
    mobile = models.CharField(max_length=250, unique=True)
    state = models.CharField(max_length=250, null=True, blank=True)
    expiration_time = models.DateTimeField()
    full_name = models.CharField(max_length=250, null=True, blank=True)
    search_type = models.CharField(max_length=250, null=True, blank=True)
    search_value = models.CharField(max_length=250, null=True, blank=True)
    national_id = models.CharField(max_length=250, null=True, blank=True)
    surname = models.CharField(max_length=250, null=True, blank=True)
    first_name = models.CharField(max_length=250, null=True, blank=True)
    address = models.CharField(max_length=250, null=True, blank=True)
    phone = models.CharField(max_length=250, null=True, blank=True)
    company_name = models.CharField(max_length=250, null=True, blank=True)
    company_reg = models.CharField(max_length=250, null=True, blank=True)
    trading_name = models.CharField(max_length=250, null=True, blank=True)
    company_address = models.CharField(max_length=250, null=True, blank=True)
    company_telephone = models.CharField(max_length=250, null=True, blank=True)
    company_mobile = models.CharField(max_length=250, null=True, blank=True)
    company_email = models.CharField(max_length=250, null=True, blank=True)
    lease_monthly_amount = models.CharField(max_length=250, null=True, blank=True)
    lease_address = models.CharField(max_length=250, null=True, blank=True)
    lease_detail = models.CharField(max_length=250, null=True, blank=True)
    lease_start_date = models.CharField(max_length=250, null=True, blank=True)
    lease_end_date = models.CharField(max_length=250, null=True, blank=True)
    lease_currency = models.CharField(max_length=250, null=True, blank=True)
    is_lease_variable = models.CharField(max_length=250, null=True, blank=True)
    lease_deposit = models.CharField(max_length=250, null=True, blank=True)
    lease_pay_limit = models.CharField(max_length=250, null=True, blank=True)
    lease_current_balance = models.CharField(max_length=250, null=True, blank=True)
    lease_last_month_balance = models.CharField(max_length=250, null=True, blank=True)
    lease_last_two_month_balance = models.CharField(max_length=250, null=True, blank=True)
    lease_last_three_month_balance = models.CharField(max_length=250, null=True, blank=True)
    lease_last_four_month_balance = models.CharField(max_length=250, null=True, blank=True)
    guarantor_id  = models.CharField(max_length=250, null=True, blank=True)
    user_id = models.CharField(max_length=250, null=True, blank=True)
    company_id = models.CharField(max_length=250, null=True, blank=True)
    lease_receiver_company =  models.CharField(max_length=250, null=True, blank=True)
    # my_list = models.CharField(max_length=100, null=True, blank=True)
    
    # def save(self, *args, **kwargs):
    #     self.my_list = str(self.my_list)  # Convert the list to a string
    #     super().save(*args, **kwargs)

    # def get_my_list(self):
    #     return eval(self.my_list)  # Convert the string back to a list
    
    class Meta:
        db_table = "chat_user_session"