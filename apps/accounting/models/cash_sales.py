# class CashSale(BaseModelWithUser):
#     """
#     Simplified cash sales for quick point-of-sale transactions
#     """

#     receipt_number = models.CharField(max_length=20, unique=True, editable=False)
#     sale_date = models.DateTimeField(default=now)
#     customer_display_name = models.CharField(max_length=255)

#     # Customer reference (optional - for registered customers)
#     customer = models.ForeignKey(
#         "accounting.Customer",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="cash_sales",
#     )

#     # Financial details
#     currency = models.ForeignKey(
#         "accounting.Currency", on_delete=models.PROTECT, default=1
#     )
#     subtotal = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )
#     discount_amount = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )
#     discount_percentage = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         default=Decimal("0.00"),
#         validators=[
#             MinValueValidator(Decimal("0.00")),
#             MaxValueValidator(Decimal("100.00")),
#         ],
#     )
#     tax_total = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )
#     total_amount = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )

#     # Payment details
#     payment_method = models.CharField(
#         max_length=20, choices=Payment.PAYMENT_METHODS, default="cash"
#     )
#     amount_tendered = models.DecimalField(
#         max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
#     )
#     change_given = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )

#     # GL Integration
#     cash_account = models.ForeignKey(
#         "accounting.GeneralLedgerAccount",
#         on_delete=models.PROTECT,
#         limit_choices_to={
#             "account_type__account_type": "asset",
#             "account_number__startswith": "10",
#         },
#         related_name="cash_sales",
#     )
#     sales_account = models.ForeignKey(
#         "accounting.GeneralLedgerAccount",
#         on_delete=models.PROTECT,
#         limit_choices_to={"account_type__account_type": "revenue"},
#         related_name="cash_sales_revenue",
#     )
#     journal_entry = models.OneToOneField(
#         "accounting.JournalEntry",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="cash_sale",
#     )

#     # Status
#     is_posted = models.BooleanField(default=False)
#     posted_date = models.DateTimeField(null=True, blank=True)

#     # Additional info
#     notes = models.TextField(blank=True, null=True)
#     reference = models.CharField(max_length=255, blank=True, null=True)

#     class Meta:
#         verbose_name = _("Cash Sale")
#         verbose_name_plural = _("Cash Sales")
#         ordering = ["-sale_date", "-id"]
#         indexes = [
#             models.Index(fields=["receipt_number"]),
#             models.Index(fields=["sale_date"]),
#             models.Index(fields=["customer"]),
#         ]

#     def __str__(self):
#         return f"Cash Sale {self.receipt_number} - {self.customer_display_name}"

#     def save(self, *args, **kwargs):
#         if not self.receipt_number:
#             # Generate receipt number: CS-YYYY-XXXXXX
#             today = timezone.now().date()
#             year = today.year
#             last_sale = (
#                 CashSale.objects.filter(sale_date__year=year).order_by("-id").first()
#             )

#             if last_sale and last_sale.receipt_number:
#                 try:
#                     last_number = int(last_sale.receipt_number.split("-")[-1])
#                     new_number = last_number + 1
#                 except (ValueError, IndexError):
#                     new_number = 1
#             else:
#                 new_number = 1

#             self.receipt_number = f"CS-{year}-{new_number:06d}"

#         # Calculate change given
#         if self.amount_tendered and self.total_amount:
#             self.change_given = self.amount_tendered - self.total_amount
#             if self.change_given < 0:
#                 self.change_given = Decimal("0.00")

#         super().save(*args, **kwargs)

#     def update_totals(self):
#         """Update sale totals from line items"""
#         line_items = self.line_items.all()

#         # Calculate subtotal
#         self.subtotal = sum(item.line_total for item in line_items)

#         # Apply discount
#         if self.discount_percentage:
#             discount_amount = (
#                 self.subtotal * self.discount_percentage / Decimal("100.00")
#             ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
#             self.discount_amount = discount_amount
#         else:
#             self.discount_amount = self.discount_amount or Decimal("0.00")

#         discounted_subtotal = self.subtotal - self.discount_amount

#         # Calculate tax total
#         self.tax_total = sum(item.tax_amount for item in line_items)

#         self.total_amount = discounted_subtotal + self.tax_total

#         # Update change given
#         if self.amount_tendered:
#             self.change_given = self.amount_tendered - self.total_amount
#             if self.change_given < 0:
#                 self.change_given = Decimal("0.00")

#         self.save(
#             update_fields=[
#                 "subtotal",
#                 "discount_amount",
#                 "tax_total",
#                 "total_amount",
#                 "change_given",
#             ]
#         )

#     def post_to_ledger(self):
#         """Create journal entry for cash sale"""

#         if self.journal_entry:
#             raise ValidationError("Cash sale already posted to ledger")

#         with transaction.atomic():
#             journal_entry = JournalEntry.objects.create(
#                 entry_date=self.sale_date.date(),
#                 entry_type="cash_receipts",
#                 description=f"Cash sale {self.receipt_number} - {self.customer_display_name}",
#                 reference=self.receipt_number,
#                 created_by=self.created_by,
#             )

#             # Cash Account - Debit
#             LedgerTransaction.objects.create(
#                 journal_entry=journal_entry,
#                 account=self.cash_account,
#                 debit_amount=self.total_amount,
#                 description=f"Cash sale {self.receipt_number}",
#                 source_transaction=self,
#             )

#             # Sales Revenue - Credit (from line items)
#             for line_item in self.line_items.all():
#                 LedgerTransaction.objects.create(
#                     journal_entry=journal_entry,
#                     account=self.sales_account,
#                     credit_amount=line_item.line_total,
#                     description=line_item.sales_item.name,
#                     tax_rate=line_item.tax_rate,
#                     tax_amount=line_item.tax_amount,
#                     source_transaction=line_item,
#                 )

#             # Tax Payable - Credit
#             if self.tax_total > 0:
#                 default_tax_type = TaxType.objects.filter(is_active=True).first()
#                 if default_tax_type:
#                     LedgerTransaction.objects.create(
#                         journal_entry=journal_entry,
#                         account=default_tax_type.payable_account,
#                         credit_amount=self.tax_total,
#                         description=f"Tax for cash sale {self.receipt_number}",
#                         source_transaction=self,
#                     )

#             journal_entry.update_totals()
#             journal_entry.post_entry()

#             self.journal_entry = journal_entry
#             self.is_posted = True
#             self.posted_date = timezone.now()
#             self.save()

#         return journal_entry

#     @property
#     def is_fully_paid(self):
#         return self.amount_tendered >= self.total_amount

#     @property
#     def balance_due(self):
#         if self.amount_tendered >= self.total_amount:
#             return Decimal("0.00")
#         return self.total_amount - self.amount_tendered


# class CashSaleLineItem(BaseModel):
#     """Line items for cash sales"""

#     cash_sale = models.ForeignKey(
#         CashSale, on_delete=models.CASCADE, related_name="line_items"
#     )
#     sales_item = models.ForeignKey(
#         "SalesItem", on_delete=models.PROTECT, related_name="cash_sale_line_items"
#     )
#     quantity = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         default=Decimal("1.00"),
#         validators=[MinValueValidator(Decimal("0.01"))],
#     )
#     unit_price = models.DecimalField(
#         max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
#     )
#     tax_rate = models.DecimalField(
#         max_digits=5, decimal_places=2, default=Decimal("0.00")
#     )
#     tax_amount = models.DecimalField(
#         max_digits=12, decimal_places=2, default=Decimal("0.00")
#     )
#     description = models.TextField(blank=True, null=True)

#     class Meta:
#         verbose_name = _("Cash Sale Line Item")
#         verbose_name_plural = _("Cash Sale Line Items")
#         ordering = ["id"]

#     def __str__(self):
#         return f"{self.cash_sale.receipt_number} - {self.sales_item.name}"

#     @property
#     def line_total(self):
#         return (self.quantity * self.unit_price).quantize(Decimal("0.01"))

#     @property
#     def line_total_with_tax(self):
#         return self.line_total + self.tax_amount

#     def save(self, *args, **kwargs):
#         # Use sales item price if unit price not provided
#         if not self.unit_price:
#             self.unit_price = self.sales_item.unit_price

#         # Use sales item tax rate if not provided
#         if not self.tax_rate and self.sales_item.tax_type:
#             self.tax_rate = self.sales_item.tax_type.rate

#         # Calculate tax amount
#         if self.tax_rate:
#             self.tax_amount = (
#                 self.line_total * self.tax_rate / Decimal("100.00")
#             ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

#         super().save(*args, **kwargs)

#         # Update cash sale totals
#         self.cash_sale.update_totals()
