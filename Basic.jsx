import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantDetails from './Components/RestaurantDetails';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [ratingOrder, setRatingOrder]= useState("asc");
  const [costOrder, setCostOrder]= useState("asc");
  const [filterRating, setFilterRating] = useState(0);
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const [cash, setCash] = useState(null);
  const [card, setCard] = useState(null);
  const [upi, setUpi] = useState(null);

  useEffect(()=>{
    fetchData({
      page, 
      ratingOrder,
      costOrder,
      filterRating, 
      q,
      cash,
      card,
      upi
    });
  },[page,ratingOrder,costOrder,filterRating,q,cash,card,upi])

  const fetchData = async ({page,ratingOrder,costOrder,filterRating,q,
    cash,
    card,
    upi
  }) => {
    setLoading(true);
    const paramsForPayment = {}
    if(cash) paramsForPayment["paymentMethods.cash"] = cash;
    if(card) paramsForPayment["paymentMethods.card"] = card;
    if(upi) paramsForPayment["paymentMethods.upi"] = upi;
    console.log(paramsForPayment)
    axios({
      method: 'get',
      url: "http://localhost:3000/food",
      params: {
        _page: page,
        _limit: 5,
        _sort: "rating,cost",
        _order: `${ratingOrder},${costOrder}`,
        rating_gte: filterRating,
        q: q,
        ...paramsForPayment
      }
    })
    .then(res => {
      console.log(res)
      setData(res.data);
      setLoading(false);
    })
    .catch(err => {
      setError(true);
      setLoading(false);
    })
  } 

  // 1000000
  // 

  console.log(data)

  return (
    <div className="App">
        <h1>Restaurant Details</h1>
        { loading && <div>loading</div>}
        <div>
          <h3>Search </h3>
          <input value={text} onChange={(e)=>setText(e.target.value)}/>
          <button onClick={()=>setQ(text)}>Search</button>
        </div>
          <br/>
        <div>
          <button disabled={costOrder==="desc"} onClick={()=>setCostOrder("desc")}>
            COST SORT BY DESC
            </button>
          <button disabled={costOrder==="asc"} onClick={()=>setCostOrder("asc")}>
            COST SORT BY ASC
            </button>
        </div>
        <div>
          <button disabled={ratingOrder==="desc"} onClick={()=>setRatingOrder("desc")}>
            RATING SORT BY DESC
            </button>
          <button disabled={ratingOrder==="asc"} onClick={()=>setRatingOrder("asc")}>
            RATING SORT BY ASC
            </button>
        </div>
        <div>
          <h4>Cash payments</h4>
          <button onClick={()=>setCash(!cash)}>CASH - { cash === null ?"NULL": cash?"TRUE":"FALSE" }</button>
          <button onClick={()=>setCard(!card)}>CARD - { card=== null ?"NULL": card?"TRUE":"FALSE" }</button>
          <button onClick={()=>setUpi(!upi)}>UPI - { upi === null ?"NULL": upi?"TRUE":"FALSE" }</button>
          <button onClick={()=>{
            setCash(null);
            setCard(null);
            setUpi(null);
          }}>RESET</button>
        </div>
        <div>
          <h4>Filter ratings</h4>
          <button onClick={()=>setFilterRating(4)}>greater than 4</button>
          <button onClick={()=>setFilterRating(3)}>greater than 3</button>
          <button onClick={()=>setFilterRating(2)}>greater than 2</button>
          <button onClick={()=>setFilterRating(1)}>greater than 1</button>
          <button onClick={()=>setFilterRating(0)}>All</button>
        </div>
        <div>
          {/* pagination */}
          <button disabled={page===1} onClick={() => setPage(page - 1)}>prev</button>
          <button onClick={() => setPage(page + 1)}>next</button>
          <PaginationComponent currentPage={page} lastPage={5} onPageChange={setPage}/>
        </div>
        <div>
          {
            data.map(item=>
              <RestaurantDetails key={item.id} {...item} />)
          }
        </div>
    </div>
  );
}

// given the current page
// given the last page
// create a pagination component

const PaginationComponent = ({
  currentPage,
  lastPage,
  onPageChange
}) => {
  const arr = new Array(lastPage).fill(0);
  return (
    <div>
      {
        arr.map( (item, page)=> <button onClick={()=>onPageChange(page+1)} disabled={(page+1)===currentPage}> {page+1} </button> )
      }
    </div>
  )
}


export default App;
