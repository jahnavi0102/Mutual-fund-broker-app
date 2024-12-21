from fastapi import Depends, FastAPI, HTTPException, status
from typing import Union
import os
from functions import create_access_token, fetch_open_ended_schemas, get_current_user
from dotenv import load_dotenv
from datetime import timedelta
from models import Token, PurchaseResponse, PurchaseRequest
from db import FUND_FAMILY
import uuid
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv(override=True)

USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("TOKEN_EXPIRATION_TIME_IN_MIN")


@app.post("/login", response_model=Token)
async def login():
    username = os.getenv('USERNAME')
    password = os.getenv('PASSWORD')
    try:
        # Check username and password
        if username != USERNAME or password != PASSWORD:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create an access token
        access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
        access_token = create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        ) from e

@app.get("/get-fund-family")
def get_fund_family(current_user: str = Depends(get_current_user)):
    return FUND_FAMILY


@app.get("/open-ended-schema/{fund_family_id}")
async def get_open_ended_schemas(fund_family_id, current_user: str = Depends(get_current_user)):
    try:
        success, result = await fetch_open_ended_schemas(int(fund_family_id))
        if not success:
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=result,
                )
        return {"Open ended Schemas": result}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        ) from e
        
         
@app.post("/purchase-mutual-fund", response_model=PurchaseResponse)
def purchase_mutual_fund(request: PurchaseRequest, current_user: str = Depends(get_current_user)):
    try:
        # TODO: Validate Scheme Code
        scheme_name = request.scheme_name
        scheme_code = request.scheme_code #validation if code exists checking in db, currently no db therefore ignoring validation here.
        units = request.units
        investor_id = request.investor_id
        nav = request.nav
        payment_details = request.payment_details
        
        # Calculate Total Amount
        total_amount = round(units * nav, 2)

        # Generate Transaction ID
        transaction_id = str(uuid.uuid4())

        # Mock Success Response
        return PurchaseResponse(
            status="success",
            transaction_id=transaction_id,
            units_purchased=request.units,
            amount=total_amount,
            nav=nav,
            scheme_name=scheme_name,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        ) from e
        