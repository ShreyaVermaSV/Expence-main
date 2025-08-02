import React, { useState, useEffect, useContext, useCallback } from 'react';
import Sidebar from '../UI/Sidebar';
import axios from 'axios';
import { MyContext } from '../Utils/MyContext';


export default function Spending() {

  var monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // let current_Month = new Date();
  const current_Year = new Date().getFullYear();

  const Array_year = [];
  for (let i = 2023; i <= parseInt(current_Year); i++) {
    Array_year.push(i);
  }


  let count = 1;
  const { userData } = useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [expense, setExpense] = useState([]);
  const [sortField, setSortField] = useState('');
  const [populateCategories, setPopulateCategories] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [Id, setId] = useState();
  const [deleteEntry, setDeleteEntry] = useState(false);
  const [month, setMonth] = useState(monthMap[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showButton, setShowButton] = useState(false);
  const [dataShowing, setDataShowing] = useState([]);

  const formatVal = (val) => {
    return Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(val);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // console.log(cost, category, date, description);
    if (cost && category && date && description) {
      await axios.post('http://localhost:5000/spending', {
        id: userData.key.id,
        cost: cost,
        category: category,
        date: date,
        description: description,
      }).then((response) => {
        // console.log('Data sent successfully', response.data);
        setShowModal(false);
        fetchData();
      }).catch((err) => {
        console.log('Error while sending data');
      });
    } else {
      console.log('Error while submitting form');
    }
    setCategory('');
    setCost('');
    setDate('');
    setDescription('');


  };

  const handleModal = () => {
    setShowButton(false);
    setShowModal(!showModal);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showModal && event.target.id === 'modal-backdrop') {
        setShowModal(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showModal]);

  const fetchData = useCallback(() => {
    // console.log("changes")
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/spending', {
        params: { id: userData.key.id },
      }).then((response) => {

        let sortedRows = [...response.data.rows];
        setExpense(sortedRows);
        let newSortedRows = sortedRows.filter((item) => {
          let date = new Date(item.transaction_date);
          let newDate = date.toLocaleString('default', { month: 'long' });
          return (newDate === month && parseInt(date.getFullYear()) === parseInt(year));
        })


        switch (sortField) {
          case 'category':
            newSortedRows.sort((a, b) => a.category.localeCompare(b.category));
            break;
          case 'date':
            newSortedRows.sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
            break;
          case 'amount':
            newSortedRows.sort((a, b) => a.amount - b.amount);
            break;
          case 'recent':
            newSortedRows.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
            break;
          case 'R-category':
            newSortedRows.sort((a, b) => b.category.localeCompare(a.category));
            break;
          case 'R-amount':
            newSortedRows.sort((a, b) => b.amount - a.amount);
            break;
          default:
            newSortedRows.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
            break;
        }
        setDataShowing(newSortedRows);
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, [userData, sortField, month, year]);

  const handleEdit = () => {
    const entry = {
      id: Id,
      category: category,
      date: date,
      amount: cost,
      description: description
    };
    axios.patch('http://localhost:5000/spending', entry)
      .then((res) => {
        // console.log(res);
        setEditModal(false);
        fetchData();
      })
      .catch((error) => {
        console.error('Error updating entry:');
      });
    setEdit(false);
  };

  const openEditModal = (data) => {
    setId(data.id);
    setCategory(data.category);
    setCost(data.amount);
    setDescription(data.description);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    return axios.delete('http://localhost:5000/spending', { data: { id } })
      .then((res) => {
        fetchData();
        setDeleteEntry(false);

      })
      .catch((error) => {
        console.error('Error deleting entry:');
      });
  };


  useEffect(() => {
    if (userData && userData.key && userData.key.id) {
      axios.get('http://localhost:5000/categories', {
        params: { id: userData.key.id },
      }).then((response) => {
        setPopulateCategories(response.data.rows);
      }).catch((error) => {
        console.error('Error fetching categories:', error);
      });
    }
    fetchData();
  }, [userData, sortField, fetchData]);


  console.log("this is data",dataShowing, expense)

  return (
    <>
      {
          <>
            <Sidebar />
            <div className="absolute left-72 top-16 overflow-auto m-8 right-0 bottom-0 max-lg:left-0 max-lg:ml-4 max-lg:mr-4">
              <div className="flex justify-center my-4 font-semibold text-2xl text-black">Transactions</div>
              <div className="p-4 w-full h-fit  bg-primary max-lg:h-fit  max-lg:m-2">
                <div className='flex justify-between items-center'>

                  <div className='hidden text-black max-lg:flex'>
                    {
                      !(edit || deleteEntry) ? <button className='' onClick={() => setShowButton(!showButton)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      </button> : <button className='bg-red-500 rounded-[12px] bg-opacity-20 text-red-600'
                        onClick={() => { setEdit(false); setDeleteEntry(false) }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                      </button>

                    }

                    {
                      showButton ? <div id="dropdown" className="absolute z-10 mt-8 bg-gray-500 divide-y divide-gray-100 p-1 rounded shadow w-28">
                        <ul clasNames="py-2 text-sm text-gray-700 " aria-labelledby="dropdownDefaultButton">
                          <li>
                            <button onClick={handleModal} className="px-2 text-primary">Add</button>
                          </li>
                          <li>
                            <button className="px-2 text-primary" disabled={deleteEntry} onClick={() => { setShowButton(false); setEdit(!edit) }}>Edit</button>
                          </li>
                          <li>
                            <button className="px-2 text-primary" disabled={edit} onClick={() => { setDeleteEntry(!deleteEntry); setShowButton(false) }}>Delete</button>
                          </li>

                        </ul>
                      </div> : <></>
                    }

                  </div>
                  <div className='flex justify-between items-center'>
                    <div className="mx-1 py-2 px-2 w-fit ring-1 ring-gray-200 rounded-[20px] max-lg:hidden">
                      <button onClick={handleModal} className="px-2 text-black">Add</button>
                    </div>
                    <div className={`mx-1 py-2 px-2 w-fit ring-1 ring-gray-200 rounded-[20px] max-lg:hidden ${edit ? 'bg-quaternary' : ''}`}>
                      <button className="px-2 text-black" disabled={deleteEntry} onClick={() => setEdit(!edit)}>{edit ? 'Cancel' : 'Edit'}</button>
                    </div>
                    <div className={`mx-1 py-2 px-2 w-fit ring-1 ring-gray-200 rounded-[20px] max-lg:hidden ${deleteEntry ? 'bg-quaternary' : ''}`}>
                      <button className="px-2 text-black" disabled={edit} onClick={() => setDeleteEntry(!deleteEntry)}>{deleteEntry ? 'Cancel' : 'Delete'}</button>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <select defaultValue={month} onChange={(e) => setMonth(e.target.value)}
                      className="bg-inherit mx-2  text-black text-sm] max-lg:py-0">
                      <option disabled>Sort By</option>
                      {
                        monthMap.map((item, index) => (
                          <option key={index} value={item}>{item}</option>
                        ))
                      }
                    </select>
                    <select defaultValue={year} onChange={(e) => setYear(e.target.value)}
                      className="bg-inherit mx-2 text-black text-sm] max-lg:py-0">
                      <option disabled >Sort By</option>
                      {
                        Array_year.map((item, index) => (
                          <option key={index} value={item}>{item}</option>
                        ))
                      }
                    </select>
                    <select onChange={(e) => setSortField(e.target.value)} className="bg-inherit text-black text-sm] max-lg:py-0">
                      <option disabled>Sort By</option>
                      <option value="recent">Recent</option>
                      <option value="date">Date</option>
                      <option value="category">Category</option>
                      <option value="amount">Amount</option>
                      <option value="R-category">Category Desc</option>
                      <option value="R-amount">Amount Desc</option>
                    </select>
                  </div>
                </div>


                <>
                  <div className="overflow-x-auto m-2">
                    <table className="min-w-full bg-inherit  text-black">
                      <thead>
                        <tr className="border border-t-0 border-l-0 border-r-0 border-gray-300 text-black">
                          <th className="text-left py-5 px-4 uppercase text-lg">ID</th>
                          <th className="text-left py-5 px-4 uppercase text-lg">Amount</th>
                          <th className="text-left py-5 px-4 uppercase text-lg">Category</th>
                          <th className="text-left py-5 px-4 uppercase text-lg">Description</th>
                          <th className="text-left py-5 px-4 uppercase text-lg">Date</th>

                          {
                            edit ? <th className="text-left py-5 px-4 uppercase text-lg">Edit</th>
                              : <></>
                          }
                          {
                            deleteEntry ? <th className="text-left py-5 px-4 uppercase text-lg">Delete</th>
                              : <></>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          dataShowing.length > 0 ?
                            dataShowing.map((item, index) => (
                            <tr key={index} className="border-b  border-gray-200">
                              <td className="text-useLayoutEffect(() => {
                                  first
                                
                                  return () => {
                                    second
                                  };
                                }, [third]) py-4 px-4 ">{count++}</td>
                              <td className="text-left py-4 px-4 text-secondary">₹{formatVal(item.amount)}</td>
                              <td className="text-left  py-4 px-4">
                                <p className='rounded-[20px] bg-opacity-10 bg-teal-500 text-teal-600 text-sm font-semibold w-fit py-2 px-4'>
                                  {item.category}
                                </p>
                              </td>
                              <td className="text-left py-4 px-4">{item.description}</td>
                              <td className="text-left py-4 px-4">{formatDate(item.transaction_date)}</td>
                              {edit ? <td className='text-left   flex justify-center py-5 px-4"'>
                                <button className='text-green-500' onClick={() => openEditModal(item)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                  </svg>


                                </button>
                              </td> : <></>
                            }

                              {deleteEntry ? <td className='text-left flex justify-center py-5 px-4"'>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className='text-red-500'>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                </button>
                              </td> : <></>
                            }
                            </tr>
                          ))
                          : <></>
                        }
                      </tbody>
                    </table>
                  </div>
                  {!(dataShowing.length) > 0?
                      <div className="flex text-black text-xl justify-center m-6">NO DATA FOUND</div>:<></>
                  }
                </>

                {showModal && (
                  <div id="modal-backdrop" className="fixed inset-0 z-50 rounded flex items-center justify-center bg-black bg-opacity-70">

                    <div className="bg-primary rounded-[12px] p-8 max-w-md w-full">
                      <div className='flex justify-end text-black'>
                        <button onClick={handleModal}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                      <h2 className="text-xl flex justify-center font-bold p-2 text-black my-5 border-b-2 border-gray-500">Add Expense</h2>
                      <div className='mb-2'>
                        <div className="text-xl mb-4 text-black">How much have to spent?</div>
                        <input placeholder='e.g. 2500' value={cost} onChange={(e) => setCost(e.target.value)} className="text-black ring-1 ring-gray-300 p-2 bg-inherit  rounded w-full focus:outline-none " type="text" />
                      </div>

                      <>
                        <div className='grid grid-cols-2'>
                          <div className='mr-2'>
                            <select id="dropdownDelay" onChange={(e) => setCategory(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'>
                              <option disabled selected={true} className='bg-inherit px-1 rounded-none'>Select Catogory</option>
                              {populateCategories.map((item) =>
                                <option value={item.category} key={item.id} className='bg-inherit text-black px-1 rounded-none'>{item.category}</option>

                              )}
                            </select>
                          </div>

                          <div className='ml-2'>
                            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none' />
                          </div>
                        </div>

                        <div className='mt-2 mb-2'>
                          <textarea placeholder='Description (optional)' value={description} onChange={(e) => setDescription(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none' />
                        </div>
                        <div className='flex justify-center'>
                          <button onClick={handleFormSubmit} className='py-2 px-4 outline-none  text-black w-full hover:bg-secondary rounded-[20px] hover:text-white'>Submit</button>
                        </div>
                      </>
                    </div>
                  </div>
                )}
                {
                  editModal ? <div id="modal-backdrop" className="fixed inset-0 z-50 rounded flex items-center justify-center bg-black bg-opacity-70">

                    <div className="bg-primary p-8 max-w-md rounded-[12px] w-full">
                      <div className='flex justify-end text-black'>
                        <button onClick={() => setEditModal(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                      <h2 className="text-xl flex justify-center font-bold p-2 text-black border-b-2 my-4 border-gray-500">Add Expense</h2>
                      <div className='mb-2'>
                        <div className="text-xl mb-4 text-black">How much have to spent?</div>
                        <input placeholder='e.g. 2500' value={cost} onChange={(e) => setCost(e.target.value)} className="text-black ring-1 ring-gray-300 p-2 bg-inherit  rounded w-full focus:outline-none " type="text" />
                      </div>

                      <>
                        <div className='grid grid-cols-2'>
                          <div className='mr-2'>
                            <select id="dropdownDelay" onChange={(e) => setCategory(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'>
                              <option disabled selected={true} className='bg-inherit px-1 rounded-none'>Select Catogory</option>
                              {populateCategories.map((item) =>
                                <option value={item.category} key={item.id} className='bg-inherit text-black px-1 rounded-none'>{item.category}</option>

                              )}
                            </select>
                          </div>

                          <div className='ml-2'>
                            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none' />
                          </div>
                        </div>

                        <div className='mt-2 mb-2'>
                          <textarea placeholder='Description (optional)' value={description} onChange={(e) => setDescription(e.target.value)} className='bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none' />
                        </div>
                        <div className='flex justify-center'>
                          <button onClick={handleEdit} className='py-2 px-4 outline-none  text-black w-full hover:bg-secondary rounded-[20px] hover:text-black'>Submit</button>
                        </div>
                      </>
                    </div>
            </div> : <></>
                }
              </div>
            </div>
          </> 
      }</>
  );
};