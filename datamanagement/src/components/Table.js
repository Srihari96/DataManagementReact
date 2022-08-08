import React, { useState, useEffect,useMemo,useRef } from 'react';
import DataTable from 'react-data-table-component';

// import FilterComponent from 'react-data-table-component';
import requests from '../requests';
import axiosInstance from '../axios';

const lodash = require("lodash");
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
    const inputEl = useRef(null);

	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [todo, setTodo] = useState([]);
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
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
    console.log(todo)
	const handleRowSelected = React.useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			
			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.id)}?`)) {
				setToggleCleared(!toggleCleared);
				setTodo(lodash.differenceBy(filteredItems, selectedRows, 'ID'));
			}
		};

		return (
			<button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>
				Delete
			</button>
		);
	}, [filteredItems, selectedRows, toggleCleared]);

    const subHeaderComponentMemo = useMemo(() => {
        const filterTextChange = (e) =>{
            setFilterText(e.target.value)
            inputEl.current.focus();
        }
        const FilterComponent = ({ filterText, onClear }) => (
            <div>
                <input
                    id='search-input'
                    ref={inputEl}
                    type="text"
                    value={filterText}
                    onChange={filterTextChange}
                    
                />
                <button type="button" onClick={onClear}>
                    X
                </button>
            </div>
        );
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };
    
    return (
        <FilterComponent onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);
    return (
        
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
)
}

export default Table