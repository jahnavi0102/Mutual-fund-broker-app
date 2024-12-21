from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class PaymentDetails(BaseModel):
    method: str
    transaction_id: Optional[str]  = None

class PurchaseRequest(BaseModel):
    scheme_code: int
    units: float
    investor_id: int
    nav: float
    scheme_name: str
    payment_details: PaymentDetails

class PurchaseResponse(BaseModel):
    status: str
    transaction_id: str
    units_purchased: float
    amount: float
    nav: float
    scheme_name: str