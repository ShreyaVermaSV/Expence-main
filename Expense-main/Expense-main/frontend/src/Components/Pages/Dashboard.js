import React, { useContext, useCallback, useEffect, useRef } from 'react'
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../Utils/getCookie';
import Sidebar from '../UI/Sidebar';
import Loading from '../UI/Loading';
import { MyContext } from '../Utils/MyContext';
import axios from 'axios';
import AnimatedArrowButton from '../UI/AnimatedArrow';
import LineChart from '../UI/LineChart';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,

} from 'chart.js';
import BarChart from '../UI/BarChart';
import DoughnutChart from '../UI/Doughnut';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {

  let current_Month = new Date();
  const forCatcurrentMonth = current_Month.toLocaleString('default', { month: 'long' });
  current_Month = current_Month.getMonth();
  const current_Year = new Date().getFullYear();
  var monthMap = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  const { userData } = useContext(MyContext);
  const [expense, setExpense] = useState(null);
  // const [authUser, setAuthUser] = useState(null);
  // const [totalExpense, setTotalExpense] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState('');
  const [newIncome, setNewIncome] = useState('');
  const [saving, setSaving] = useState('');
  const [categoryData, setCategoryData] = useState({});
  const [year, setYear] = useState(2024);
  const [currentMonthExp, setCurrentMonthExp] = useState(0);

  const [savingData, setSavingData] = useState({});
  const [catMonth, setCatMonth] = useState(forCatcurrentMonth);
  let Array_year = [];

  const [chartData, setChartData] = useState({
    jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
    jul: 0, aug: 0, sept: 0, oct: 0, nov: 0, dec: 0
  });

  // useEffect(() => {
  //   const verifyToken = () => {
  //     const token = getCookie('token');
  //     if (token) {
  //       const decodedToken = jwtDecode(token); // Correct usage
  //       setUserData({ key: decodedToken });
        
  //       setAuthUser(decodedToken);
  //       console.log('------->', authUser);
  //     }
  //   };
  //   verifyToken();
  // }, [setUserData]);

  const fetchData = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios
        .get('http://localhost:5000/dashboard', {
          params: { id: userData.key.id },
        })
        .then((response) => {
          setExpense(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userData]);



 
  const fetchIncome = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/income', {
        params: { id: userData.key.id },
      })
        .then((response) => {
          setIncome(response.data.income);
        })
        .catch((err) => {
          console.log('Error fetching income');
        });
    }
  }, [userData])


  const formatVal = (val) => {
    return Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(val)

  }


  useEffect(() => {
    fetchData();
    fetchIncome();
  }, [fetchData, fetchIncome, userData, newIncome, income]);

  const fetchChartData = useCallback(() => {
    let temp = 0;
    let categoryArray = [];
    if (expense) {
      const monthlyExpenses = {
        jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
        jul: 0, aug: 0, sept: 0, oct: 0, nov: 0, dec: 0
      };
      expense.rows.forEach(item => {
        const date = new Date(item.transaction_date);
        const amount = parseInt(item.amount);
        const month = date.getMonth();
        const monthforCategory = date.toLocaleString('default', { month: 'long' });
        const yr = date.getFullYear();
        const crnt_month = new Date().getMonth();
        if (month === crnt_month && yr === parseInt(current_Year)) {
          temp = temp + amount;
        }

        // console.log('month->',month)
        if (yr === parseInt(year) && monthforCategory === catMonth) {
          categoryArray.push(item);          
          temp = temp + amount;

        }
        if (yr === parseInt(year)) {
          switch (month) {
            case 0: monthlyExpenses.jan += amount; break;
            case 1: monthlyExpenses.feb += amount; break;
            case 2: monthlyExpenses.mar += amount; break;
            case 3: monthlyExpenses.apr += amount; break;
            case 4: monthlyExpenses.may += amount; break;
            case 5: monthlyExpenses.jun += amount; break;
            case 6: monthlyExpenses.jul += amount; break;
            case 7: monthlyExpenses.aug += amount; break;
            case 8: monthlyExpenses.sept += amount; break;
            case 9: monthlyExpenses.oct += amount; break;
            case 10: monthlyExpenses.nov += amount; break;
            case 11: monthlyExpenses.dec += amount; break;
            default: break;
          }
        }
      });
      setChartData(monthlyExpenses);
      setSavingData({
        jan: income - monthlyExpenses.jan,
        feb: income - monthlyExpenses.feb,
        mar: income - monthlyExpenses.mar,
        apr: income - monthlyExpenses.apr,
        may: income - monthlyExpenses.may,
        jun: income - monthlyExpenses.jun,
        jul: income - monthlyExpenses.jul,
        aug: income - monthlyExpenses.aug,
        sept: income - monthlyExpenses.sept,
        oct: income - monthlyExpenses.oct,
        nov: income - monthlyExpenses.nov,
        dec: income - monthlyExpenses.dec
      });
    }
    setCategoryData(categoryArray);
    setSaving(Number(income) - Number(temp));
    setCurrentMonthExp(temp);
    // setTotalExpense(totalCost);
  }, [expense, income, year, catMonth, current_Year]);

  useEffect(() => {
    fetchChartData();
  }, [expense, fetchChartData, setYear, year, fetchData]);


  const handleIncomeSubmit = async () => {
    try {
        if(!income){
          const response = await axios.post('http://localhost:5000/income', {
          userId: userData.key.id,
          income: newIncome,
        }).then((response) => {
          // console.log('Income submitted', response);
          fetchIncome();
        })
        if (response.status === 200) {
          setNewIncome('');
          setShowModal(false);
        }
      }else{
        const response = await axios.patch('http://localhost:5000/income', {
          userId: userData.key.id,
          income: newIncome,
        }).then((response) => {
          console.log('Income updated', response);
          fetchIncome();
        })
        if (response.status === 200) {
          setNewIncome('');
          setShowModal(false);
        }
      }
    } catch (error) {
      // console.error('Error submitting income:');
    }
  };

  for (let i = 2023; i <= parseInt(current_Year); i++) {
    Array_year.push(i);
  }

  return (
    <>
      {
        (userData) ?

          <>
            <Sidebar />
            <div className="absolute left-72 p-1 top-16 overflow-auto m-8 right-0 bottom-0 max-lg:left-0 max-lg:ml-4 max-lg:mr-4">
              <div className='flex justify-between max-lg:grid grid-cols-1 mb-2 h-fit '>


                <h1 className={`${income > 0 ? '' : 'flex'} rounded-[12px] text-black bg-primary p-4 mr-4 text-2xl max-lg:mb-2  max-lg:mr-0`}>
                  {
                    income > 0 ? <div className={`text-sm flex justify-end ${income === '' ? 'hidden' : ''}`}>
                      <p className=''>{monthMap[current_Month]} {current_Year}</p>
                    </div> : <></>
                  }
                  <div className='flex items-center justify-between'>
                    <p className={`${income > 0 ? 'font-semibold rounded-[20px] w-fit bg-opacity-10 my-2 bg-blue-600 py-2 px-4 text-blue-500' : 'text-3xl font-extralight'} `}>
                      {income > 0 ? `₹${formatVal(income)}` : 'Enter Your Monthly Income'}
                    </p>
                    {income > 0 ? '' : <AnimatedArrowButton />}
                    <button className='p-1' onClick={() => setShowModal(!showModal)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                    </button>
                  </div>
                  <p className='text-3xl font-extralight my-3'>{income > 0 ? 'Monthly Income' : ''}</p>
                </h1>




                <h1 className={`${income > 0 ? '' : 'flex items-center'} rounded-[12px] text-black bg-primary p-4 mr-4 text-2xl max-lg:mb-2 max-lg:mr-0`}>
                  {
                    income > 0 ? <div className={`text-sm flex justify-end ${income === '' ? 'hidden' : ''}`}>
                      <p className=''>{monthMap[current_Month]} {current_Year}</p>
                    </div> : <></>
                  }
                  <p className={`rounded-[20px] w-fit bg-opacity-10 ${income > 0 ? 'bg-red-700 py-2 my-2 font-semibold px-4 text-red-600' : ''}`}>
                    {income > 0 ? `₹${formatVal(currentMonthExp)}` : ''}
                  </p>
                  <p className='text-3xl font-extralight my-3'>{income > 0 ? 'Monthly Expenses' : 'Not enough Data'}</p>
                </h1>

                <h1 className='rounded-[12px] text-black bg-primary p-4 text-2xl'>
                  {
                    income > 0 ? <div className={`text-sm flex justify-end ${income === '' ? 'hidden' : ''}`}>
                      <p className=''>{monthMap[current_Month]} {current_Year}</p>
                    </div> : <></>
                  }
                  <p className={`rounded-[20px] w-fit bg-opacity-10 ${income > 0 ? 'bg-green-600 my-2 font-semibold py-2 px-4 text-green-500' : ''}`}>
                    {income > 0 ? `₹${formatVal(saving)}` : ''}
                  </p>
                  <p className='text-3xl font-extralight my-3'>{income > 0 ? 'Monthly Savings' : 'Not enough Data'}</p>
                </h1>
              </div>
              <div className='my-2 text-black'>
                <div className='py-1 font-semibold  ring-transparent flex justify-end max-lg:justify-center'>
                  <div className='bg-gray-950 p-1 px-2 bg-opacity-10  rounded-l-[12px] text-black'>
                    <h1>Showing Data of Year</h1>
                  </div>
                  <select defaultValue={current_Year} className="bg-gray-950 bg-opacity-10 text-black rounded-r-[12px] text-sm" onChange={(e) => setYear(e.target.value)}>
                    {
                      Array_year.map((item, index) => {
                        return <option key={index} value={item} className='text-black'>{item}</option>

                      })
                    }
                  </select>
                </div>
              </div>

              {showModal && (
                <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white rounded-[12px] p-8 max-w-md w-full">
                    <div className='flex justify-end text-black'>
                      <button onClick={() => setShowModal(!showModal)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className='mt-2'>
                      <div className="text-2xl mb-4 text-black">{income > 0 ? 'Want to update your income!!' : 'Enter your monthly income!!'}</div>
                      <input placeholder='e.g. 25000' value={newIncome} onChange={(e) => setNewIncome(e.target.value)} className="text-black bg-primary p-2 mb-6 rounded-[20px] w-full focus:outline-none m-1" type="text" />
                    </div>
                    <div className='flex justify-center'>
                      <button onClick={handleIncomeSubmit} className='py-2 px-2 text-black w-full ring-1 ring-gray-200 hover:text-white hover:bg-secondary rounded-[20px] '>Submit</button>
                    </div>
                  </div>
                </div>
              )}
              <div className='grid grid-cols-1'>
                <div className='p-2 bg-primary mb-5'>
                  <div className='px-2 text-black flex p-1'>
                    <h1>Monthly Expenses</h1>
                  </div>

                  <div className='flex justify-center p-4' >
                    <BarChart chartData={chartData} />
                  </div>
                </div>

                {/* DoughnutChart */}
                <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1 max-lg:gap-0">
                  <div className="bg-primary">
                    <div className='grid grid-cols-1 text-black'>

                      <div className='p-2 flex justify-center items-center'>
                        <div className='flex w-full justify-between'>
                          <div className='flex justify-center '>
                            <h1>Monthly Category wise Expense </h1>
                          </div>
                          <select defaultValue={catMonth} className="rounded-[20px] bg-primary px-2 text-sm " onChange={(e) => setCatMonth(e.target.value)}>
                            {
                              monthMap.map((item, index) => {
                                return <option key={index} value={item}>{item}</option>

                              })
                            }
                          </select>

                        </div>


                      </div>
                    </div>

                    <div className='flex justify-center' >

                      {
                        categoryData.length > 0 ? <DoughnutChart categoryData={categoryData} /> : <p className='mt-10 font-mono text-xl text-black'>No data available</p>
                      }

                    </div>



                  </div>


                  {/* Line Chart */}
                  <div className="col-span-2 max-lg:mt-4">
                    <div className="p-2 h-full bg-primary">
                      <div className='flex justify-between text-black '>
                        <div className='px-2 p-1'>
                          <h1>Monthly Savings</h1>
                        </div>

                      </div>


                      {
                        <LineChart savingData={savingData} />
                      }


                    </div>


                  </div>




                </div>
              </div>
            </div>
          </>
          :

          <Loading />

      }

    </>
  )
}
