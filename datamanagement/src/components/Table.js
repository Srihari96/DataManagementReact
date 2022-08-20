import React, { useState, useEffect,useMemo,useCallback } from 'react';
import DataTable from 'react-data-table-component';

// import FilterComponent from 'react-data-table-component';
import requests from '../requests';
import axiosInstance from '../axios';
import Form from './Form';

const columns = [
    {
        name: 'User ID',
        selector: row => row.userId,
        sortable: true,
    },{
        name: 'ID',
        selector: row => row.id,
        sortable: true,
    },{
        name: 'Title',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Completed',
        selector: row => (row.completed).toString(),
        sortable: true,
    },
];

  

const Table = () => {
    const fetchUrl = requests.fetchTodo

	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [todo, setTodo] = useState([]);

	const [selectedRows, setSelectedRows] = useState([]);
	const [toggleCleared, setToggleCleared] = useState(false);
    useEffect(() => {
        async function fetchData() {
          const request = await axiosInstance.get(fetchUrl);
          setTodo(request.data);
          return request;
        }
        fetchData();
      }, [fetchUrl]);
    
    const [filterText, setFilterText] = useState('');
    const filteredItems = todo.filter(item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()));
	const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = useMemo(() => {
		const handleDelete = () => {
			
			if (
                window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.id)}?`)
                )
                 {
				setToggleCleared(!toggleCleared);
                let newArray = [];
                selectedRows.map(r => newArray.push(r.id))
				setTodo(todo.filter(item=> !newArray.includes(item.id)));
			}
		};

		return (
			<button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>
				Delete
			</button>
		);
	}, [todo, selectedRows, toggleCleared]);

    const subHeaderComponentMemo = () => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        
    };
    return (
        <>
        <Form alltodo={todo} addTodo={setTodo} />
        <DataTable
        title="Table List"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        persistTableHead
        />
        </>
)
}

const FilterComponent = ({ filterText, onClear,onFilter }) => (
    <div>
        <input
            type="text"
            value={filterText}
            onChange={onFilter}
            
        />
        <button type="button" onClick={onClear}>
            X
        </button>
    </div>
);

export default Table