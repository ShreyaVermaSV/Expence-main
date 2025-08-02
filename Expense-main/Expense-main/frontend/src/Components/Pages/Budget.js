import React, { useCallback, useContext, useEffect, useState } from 'react';
import Sidebar from '../UI/Sidebar';
import axios from 'axios';
import { MyContext } from '../Utils/MyContext';
import Loading from '../UI/Loading';

export default function Budget() {
  const date = new Date();
  const current_Month = date.getMonth();
  const prev_month = current_Month - 1;
  const current_Year = date.getFullYear();
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const { userData } = useContext(MyContext);
  const [populateCategories, setPopulateCategories] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [catMap, setCatMap] = useState(new Map());
  const [expense, setExpense] = useState([]);
  const [temp, setTemp] = useState(new Map());
  const [showModal, setShowModal] = useState(false);
  const [cost, setCost] = useState();
  const [category, setCategory] = useState();
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [income, setIncome] = useState(0);
  const [totalMonthlyBudgetData, setTotalMonthlyBudgetData] = useState([]);
  const [totalMonthlyExpense, setTotalMonthlyExpense] = useState();
  const [monthlyBudget, setMonthlyBudget] = useState();
  const [incomeId, setIncomeId] = useState();
  const [previousMonthBudget, setPreviousMonthBudget] = useState();
  const [includePrevMonthBudget, setIncludePrevMonthBudget] = useState();
  const [deleteBudget, setDeleteBudget] = useState(false);
  const [editCost, setEditCost] = useState();
  const [editCategory, setEditCategory] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [editBudgetId, setEditBudgetId] = useState();


  const add = (a, b) => {
    return Number(a ? a : 0) + Number(b ? b : 0);
  }


  const fetchCategories = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/categories', {
        params: { id: userData.key.id },
      }).then((response) => {
        let cat_Array = new Map();
        response.data.rows.forEach((row) => {
          cat_Array.set(row.id, row.category);
        });
        setCatMap(cat_Array);
        setPopulateCategories(response.data.rows);
      });
    }
  }, [userData]);




  const fetchBudgetData = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/budgets', {
        params: { id: userData.key.id },
      }).then((response) => {
        let Data = [...response.data];
        let currMonthData = Data.filter((item) => {
          return (item.month === current_Month && item.year === current_Year);
        });
        setBudgetData(currMonthData);
      });
    }
  }, [current_Month, current_Year, userData]);


  const fetchIncome = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/income', {
        params: { id: userData.key.id },
      })
        .then((response) => {
          setIncome(response.data.income);
          setIncomeId(response.data.id);
        })
        .catch((err) => {
          console.log('Error fetching income');
        });
    }
  }, [userData])


  const fetchExpense = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/spending', {
        params: { id: userData.key.id },
      }).then((response) => {
        let Data = [...response.data.rows];
        setExpense(Data);
        let currMonthData = Data.filter((item) => {
          let date = new Date(item.transaction_date);
          let newDate = date.getMonth();
          return (newDate === current_Month && parseInt(date.getFullYear()) === parseInt(current_Year));
        });
        let totalExpense = 0;
        currMonthData.forEach((item) => {
          totalExpense += parseInt(item.amount);
        })
        setTotalMonthlyExpense(totalExpense);

        let catAmountMap = new Map();
        currMonthData.forEach((item) => {
          if (!catAmountMap.has(item.category)) {
            catAmountMap.set(item.category, 0);
          }
          catAmountMap.set(item.category, catAmountMap.get(item.category) + parseInt(item.amount));
        });

        setTemp(catAmountMap);
        setExpense(currMonthData);
      });
    }
  }, [current_Month, current_Year, userData]);

  const fetchTotalMonthlyBudget = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/monthly_budget', {
        params: {
          id: userData.key.id,
          month: current_Month,
          year: current_Year,
          prevMonth: prev_month,
        },
      }).then((response) => {
        console.log("look here", response.data.rows);
        let filterData = response.data.rows.filter((item) => {
          return (item.month == current_Month && item.year == current_Year);
        })

        let prevMonthData = response.data.rows.filter((item) => {
          return (item.month == prev_month && item.year == current_Year);
        })
        if (prevMonthData.length > 0) setPreviousMonthBudget(parseInt(prevMonthData[0].remaining_budget));
        if (filterData.length > 0) setTotalMonthlyBudgetData(filterData[0]);
      });
    }

  }, [current_Month, current_Year, userData, prev_month])


  const AddMonthlyBudget = useCallback(() => {
    if (userData && userData.key && userData.key.id) {
      axios.post('http://localhost:5000/monthly_budget', {
        id: userData.key.id,
        income_id: incomeId,
        month: current_Month,
        year: current_Year,
        monthlyBudget: includePrevMonthBudget === 'Yes' ? add(monthlyBudget, previousMonthBudget) : monthlyBudget
      }).then((res) => {
        console.log(res);
        setShowMonthlyModal(false);
        fetchTotalMonthlyBudget();
      });
    }
  }, [current_Month, current_Year, fetchTotalMonthlyBudget, includePrevMonthBudget, monthlyBudget, previousMonthBudget, userData, incomeId])





  useEffect(() => {
    fetchCategories();
    fetchBudgetData();
    fetchIncome();
    fetchExpense();
    fetchTotalMonthlyBudget();
  }, [fetchBudgetData, fetchCategories, fetchExpense, userData, fetchIncome, fetchTotalMonthlyBudget, previousMonthBudget]);

  const handleFormSubmit = async (e) => {
    console.log(cost, category, current_Month, current_Year);
    e.preventDefault();
    if (userData && userData.key && userData.key.id) {
      await axios.post('http://localhost:5000/budgets', {
        id: userData.key.id,
        amount: parseInt(cost),
        category_id: category,
        month: current_Month,
        year: current_Year,
      }).then((response) => {
        console.log(response);
        setShowModal(false);
        setCost('');
        setCategory('');
        fetchBudgetData(); // Trigger fetching the updated budget data
      });
    }
  };

  const handleDelete = async (id) => {
    if (userData && userData.key && userData.key.id) {
      await axios.delete('http://localhost:5000/budget', {
        data: {
          budget_id: id,
          user_id: userData.key.id,
        },
      }).then((response) => {
        console.log(response);
        fetchBudgetData();
      });
    }
  }

  const handleEditFormSubmit = async (id) => {
    if(userData && userData.key && userData.key.id){
      await axios.patch('http://localhost:5000/budget', {
        user_id: userData.key.id,
        amount: parseInt(editCost),
        category_id: editCategory,
        budget_id: editBudgetId
      
      }).then((response) => {
        console.log(response);
        setShowEditModal(false);
        setEditCost('');
        setEditCategory('');
        fetchBudgetData();
      })
    }
  }


  const calculateProgress = (spent, budget) => {
    return (spent / budget) * 100;
  };

  const formatVal = (val) => {
    return Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(val);
  };

  console.log(incomeId)
  return (
    <>
      <Sidebar />
      <div className='absolute left-72 p-1 top-16 overflow-auto m-8 right-0 bottom-0 max-lg:left-0 max-lg:ml-4 max-lg:mr-4'>
        <div className="flex justify-center my-4 font-semibold text-2xl text-black">Budget</div>

        <div className='bg-primary h-fit rounded-[12px] grid grid-cols-1 p-3'>
          <div 
          title={totalMonthlyBudgetData.monthly_budget?'You have already set budget for this month':'Please add monthly budget'}
              
          className="my-4 rounded-[18px] ring-1 ring-gray-300 hover:bg-secondary hover:text-white w-fit p-2">
            <button
              disabled={totalMonthlyBudgetData.monthly_budget ?true:false}
              onClick={() => { income ? setShowMonthlyModal(!showMonthlyModal) : window.alert('Add income before you set budget!') }}
            >Set Monthly Budget</button>
          </div>
          <div className="flex w-full my-2 h-2.5 bg-quaternary rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div
              className={`flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition duration-500
              ${calculateProgress(totalMonthlyExpense, totalMonthlyBudgetData.monthly_budget) > 79 ? 'bg-red-700' : (calculateProgress(totalMonthlyExpense, totalMonthlyBudgetData.monthly_budget) > 49 ? 'bg-yellow-500' : 'bg-green-500')}
            `}
              style={{ width: `${calculateProgress(totalMonthlyExpense, totalMonthlyBudgetData.monthly_budget)}%` }}

            >
            </div>
          </div>
          <div className="flex justify-between text-gray-500 font-normal text-xs">
            <p className=''>{calculateProgress(totalMonthlyExpense, totalMonthlyBudgetData.monthly_budget) ? parseInt(calculateProgress(totalMonthlyExpense, totalMonthlyBudgetData.monthly_budget)) : 0}% Spent</p>
            <p className=''>Budget: {totalMonthlyBudgetData.monthly_budget ? formatVal(totalMonthlyBudgetData.monthly_budget) : 'Yet to add budget'}</p>
          </div>



        </div>
        <div className="mt-3  bg-primary overflow-auto p-4">
          <div className='flex justify-between p-2 mb-3'>
            <div className="font-semibold text-2xl max-lg:text-xl">Budget Progress</div>
            <div className="flex  justify-center">
              <div className="grid grid-cols-3 gap-3">
                <button
                  title={parseInt(totalMonthlyBudgetData.monthly_budget) > 0 ? '' : 'Please add monthly budget'}
                  disabled={parseInt(totalMonthlyBudgetData.monthly_budget) > 0 ? false : true}
                  onClick={() => setShowModal(!showModal)}
                  className="flex justify-center items-center rounded-[20px] py-2 px-2 ring-1 ring-gray-300 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden size-5 max-sm:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <p className='max-sm:hidden px-2'>Add</p>
                </button>
                <button
                  disabled={deleteBudget}
                  onClick={() => setEditBudget(!editBudget)}
                  className={`flex justify-center items-center rounded-[20px] py-2 px-2 ring-1 ring-gray-300  w-fit ${editBudget?'bg-quaternary':''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden size-5 max-sm:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>

                  <p className='max-sm:hidden px-2'>{
                    editBudget?'Cancel':'Edit'
                  
                  }</p>
                </button>
                <button
                  disabled={editBudget}
                  onClick={() => setDeleteBudget(!deleteBudget)}
                  className={`flex justify-center items-center rounded-[20px] py-2 px-2 ring-1 ring-gray-300  w-fit ${deleteBudget?'bg-quaternary':''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden size-5 max-sm:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  <p className={`max-sm:hidden px-2 `}>{
                    deleteBudget?'Cancel':'Delete'
                  }</p>
                </button>
              </div>

            </div>

          </div>
          <div className={`${budgetData.length > 0 ? 'grid grid-cols-3 gap-4 h-fit max-sm:grid-cols-1 max-lg:grid-cols-2' : 'flex'}`}>
            {
              budgetData.length > 0 ?
                budgetData.map((item, index) => (


                  <div key={index}
                    title={`Amount Spent: ${formatVal(temp.get(catMap.get(item.category_id)))}\nAmount Remaining: ${formatVal(item.amount - temp.get(catMap.get(item.category_id)))}
                `}
                    className='grid hover:bg-slate-200 rounded-[12px] ring-1 ring-gray-300 p-3 my-4 grid-cols-1'>
                    <div className="flex justify-between">
                      <label className="text-sm font-semibold rounded-[20px] bg-opacity-10 w-fit">{catMap.get(item.category_id)}</label>
                      {
                        deleteBudget && <button onClick={() => handleDelete(item.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                        </button>
                      }
                      {
                        editBudget && <button onClick={() => {setShowEditModal(!showEditModal);setEditBudgetId(item.id)}}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                        </button>
                      
                      }

                    </div>
                    <div className="flex w-full my-2 h-1.5 bg-quaternary rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                      <div
                        className={` flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition duration-1000
                           ${calculateProgress(temp.get(catMap.get(item.category_id)), item.amount) > 79 ? 'bg-red-700' : (calculateProgress(temp.get(catMap.get(item.category_id)), item.amount) > 49 ? 'bg-yellow-500' : 'bg-green-500')}
                         `}
                        style={{ width: `${calculateProgress(temp.get(catMap.get(item.category_id)), item.amount)}%` }}

                      >
                      </div>
                    </div>
                    <div className="flex justify-between text-gray-500 font-normal text-xs">
                      <p className=''>{calculateProgress(temp.get(catMap.get(item.category_id)), item.amount) ? parseInt(calculateProgress(temp.get(catMap.get(item.category_id)), item.amount)) : 0}% Spent</p>
                      <p className=''>Budget: {formatVal(item.amount)}</p>
                    </div>
                  </div>



                ))
                : <div className='flex justify-center w-full'>
                  <p>No Data to Show</p>
                </div>
            }
          </div>
        </div>
      </div>
      {showModal && (
        <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-[12px] p-8 max-w-md w-full">
            <div className='flex justify-end text-black'>
              <button
                onClick={() => setShowModal(!showModal)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1'>

              <div className='mr-2'>
                <div className='mb-2'>
                  <div className="text-xl mb-4 text-black">Allocate budget?</div>
                  <input placeholder='e.g. 2500'
                    value={cost} onChange={(e) => setCost(e.target.value)}
                    className="text-black ring-1 ring-gray-300 p-2 bg-inherit rounded-lg w-full focus:outline-none " type="text" />
                </div>

                <select id="dropdownDelay"
                  onChange={(e) => setCategory(e.target.value)}
                  className='mb-4 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-inherit focus:outline-none'>
                  <option disabled selected={true} className='bg-inherit px-1 rounded-none'>Select Catogory</option>
                  {populateCategories.map((item) =>
                    <option value={item.id} key={item.id} className='bg-inherit text-black px-1 rounded-none'>{item.category}</option>

                  )}
                </select>
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                onClick={handleFormSubmit}
                className='py-2 px-4 text-black w-full hover:bg-secondary rounded-[20px] hover:text-white'>Submit</button>
            </div>

          </div>

        </div>

      )}
      {showEditModal && (
        <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-[12px] p-8 max-w-md w-full">
            <div className='flex justify-end text-black'>
              <button
                onClick={() => setShowEditModal(!showEditModal)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1'>

              <div className='mr-2'>
                <div className='mb-2'>
                  <div className="text-xl mb-4 text-black">Allocate budget?</div>
                  <input placeholder='e.g. 2500'
                    value={editCost} onChange={(e) => setEditCost(e.target.value)}
                    className="text-black ring-1 ring-gray-300 p-2 bg-inherit rounded-lg w-full focus:outline-none " type="text" />
                </div>

                <select id="dropdownDelay"
                  onChange={(e) => setEditCategory(e.target.value)}
                  className='mb-4 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-inherit focus:outline-none'>
                  <option disabled selected={true} className='bg-inherit px-1 rounded-none'>Select Catogory</option>
                  {populateCategories.map((item) =>
                    <option value={item.id} key={item.id} className='bg-inherit text-black px-1 rounded-none'>{item.category}</option>

                  )}
                </select>
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                onClick={handleEditFormSubmit}
                className='py-2 px-4 text-black w-full hover:bg-secondary rounded-[20px] hover:text-white'>Submit</button>
            </div>

          </div>

        </div>

      )}
      {showMonthlyModal && (
        <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          {
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-end">
                <button onClick={() => { setShowMonthlyModal(!showMonthlyModal) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <label className="flex justify-center text-lg font-normal text-gray-700">
                  Your Monthly Income is  &nbsp;  <span className="text-blue-500"> ₹{income ? formatVal(income) : 0}</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="block text-lg font-normal text-gray-700">
                  How much money would you like to allocate?
                </label>
                <input
                  placeholder="e.g. 25000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="mt-2 text-black bg-gray-100 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                />
              </div>
              <div className="mt-4">
                <label className="block text-lg font-normal text-gray-700">
                  Include last month's remaining budget of <span className="text-green-500">₹{previousMonthBudget ? formatVal(previousMonthBudget) : 0}</span>?
                </label>
                <select
                  onChange={(e) => setIncludePrevMonthBudget(e.target.value)}
                  className="mt-2 rounded-lg p-3 w-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option disabled selected>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="mt-4 text-lg font-normal text-gray-700">
                Your total budget is  &nbsp;  <span className="text-green-500">₹{includePrevMonthBudget === 'Yes' ? formatVal(add(Number(monthlyBudget), Number(previousMonthBudget))) : monthlyBudget ? formatVal(monthlyBudget) : 0}</span>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={AddMonthlyBudget}
                  className="py-2 px-4 w-full hover:bg-secondary hover:text-white rounded-[20px] hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          }
        </div>
      )}

    </>
  );
}
