from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Body, Query
from pydantic import BaseModel, Field
from typing import Union
from typing_extensions import Annotated
from routes.main import get_category
from fastapi import Request
from dotenv import load_dotenv, dotenv_values



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[dotenv_values()['ALLOWED_ORIGIN']]
)



class Item(BaseModel):
    name: str
    price: float
    tax: Union[float, None] = None
    description: Union[str, None] = Field(
        default=None, title="The description of the item", max_length = 3
    )

class Video(BaseModel):
    title: str
    description: str


@app.put("/items/{item_id}")
def change_items(item_id: int, item: Annotated[Union[Item, None], Body()]):
    return {"item_id": item_id, "item": item}




@app.get("/items")
def f(number: Annotated[Union[str, None], Query(min_length=3)]):
    return {
        "message": f"tumne ye bheja {number}"
    }


@app.get("/items/{item_id}")
def read_item(item_id: int, is_short : bool, q: str | None = None):
    if(q is None):
        if(is_short):
            return {
                "message": "ailaa, sahi mei chhota"
            }
        else: 
            return {
                "item_id": item_id,
                "q": q,
                "message": "kafi lamba hai re"
            }
    return {
        "message": f"q kaahi daal die {q}"
    }


@app.post('/api/v1/getcategory')
async def receive_data(request: Request, video_info: Annotated[Union[Video, None], Body()]):
    body = await request.json()
    headers = request.headers
    print(f"Request body: {body}")
    print(f"Request headers: {headers}")
    return get_category(video_info)

@app.get("/")
def read_root():
    return {"Hello": "World"}

