import React from 'react'
import ReactTable from 'react-table'
import R from 'ramda'
import DatePicker from 'material-ui/DatePicker'
import moment from 'moment'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

const defaultStartDate = new Date(moment().startOf('year').format())
const defaultEndDate = new Date(moment().format())

const styles = {
  datepicker: {},
  textField: {
    textAlign: 'center',
  },
}

const columnDefs = [
  {
    Header: 'Name',
    accessor: 'name',
    filterable: true,
  },
  {
    Header: 'Office',
    id: 'officeName',
    accessor: 'office.name',
  },
  {
    Header: 'Hours',
    accessor: 'hours',
  },
]

const filterMethod = (filter, row, column) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(filter.value.toLowerCase()) : true
}

const containerProps = () => ({
  style: {
    border: 'none',
  },
})

const tableProps = () => ({
  style: {
    border: 'none',
  },
})

const theadProps = () => ({
  style: {
    boxShadow: 'none',
  },
})

const thProps = () => ({
  style: {
    border: 'none',
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    boxShadow: 'none',
    fontWeight: 'bold',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: 10,
  },
})

const tableExporter = (startDate, endDate, onStartChange, onEndChange, state, makeTable, instance) => {
  const headers = 'Name,Office,Hours\n'

  const csv = state.pageRows.reduce((acc, row) => (acc += `${row.name},${row.officeName},${row.hours}\n`), headers)

  const octetStream = encodeURIComponent(csv)

  return (
    <div>
      <div className={s.toolbar}>
        <div className={s.dates}>
          <DatePicker
            hintText="Start"
            className={s.datepicker}
            style={styles.datepicker}
            textFieldStyle={styles.textField}
            value={startDate || defaultStartDate}
            onChange={(_, date) => onStartChange(date)}
            autoOk
          />
          <DatePicker
            hintText="End"
            className={s.datepicker}
            style={styles.datepicker}
            textFieldStyle={styles.textField}
            value={endDate || defaultEndDate}
            onChange={(_, date) => onEndChange(date)}
            autoOk
          />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <a href={`data:application/octet-stream;filename=export.csv,${octetStream}`} download="export.csv">
          Export as CSV
        </a>
      </div>
      {makeTable()}
    </div>
  )
}

const Reporting = ({ users, startDate, endDate, onStartChange, onEndChange }) => (
  <ReactTable
    columns={columnDefs}
    data={users}
    showPagination={false}
    defaultPageSize={users.length}
    minRows={0}
    defaultFilterMethod={filterMethod}
    getProps={containerProps}
    getTableProps={tableProps}
    getTheadProps={theadProps}
    getTheadThProps={thProps}
    getTrGroupProps={trProps}
    getTrProps={trProps}
    getTdProps={tdProps}
  >
    {R.partial(tableExporter, [startDate, endDate, onStartChange, onEndChange])}
  </ReactTable>
)

export default Reporting
