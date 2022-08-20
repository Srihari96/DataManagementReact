import React, { useState} from 'react';


const Form = (props) => {
    const {alltodo,addTodo} = props;   

    const [inputs, setInputs] = useState({'user_id':'','title':''});
    const [checkboxinput, setCheckboxinput] = useState(false);
  
    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
    
    const handleCheckboxinputChange = () => {
     setCheckboxinput(!checkboxinput)
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      let todo_id = Math.max(...alltodo.map(o => o.id)) +1
      let data = {'id':todo_id,'userId':Number(inputs.user_id),'title':inputs.title,'completed':checkboxinput}
      let items = [data,...alltodo]
      addTodo(items)
    }
  
    return (
      <div className='shadow p-5 mx-auto w-50 mt-5 mb-3'>
        <form className='form' onSubmit={handleSubmit}>
          <div className='mb-3'>
          <label className="form-label">Enter User id:
          <input
            className="form-control" 
            type="number" 
            name="user_id" 
            value={inputs.user_id || ""} 
            onChange={handleChange}
          />
          </label>
          </div>
          <div className='mb-3'>
          <label className="form-label">Enter Title:
            <input
            className="form-control" 
              type="text" 
              name="title" 
              value={inputs.title || ""} 
              onChange={handleChange}
            />
            </label>
          </div>
          <div className="form-check">
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Is Completed
          <input
            id="flexSwitchCheckDefault"
            className="form-check-input"
            type="checkbox" 
            key="is_completed"
            name="is_completed"
            checked={checkboxinput}
            onChange={handleCheckboxinputChange}
          />
            </label>
          </div>
          <input className='mt-3 btn btn-primary' type="submit" />
        </form>
      </div>
    )
  }

export default Form