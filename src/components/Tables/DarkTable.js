import React from 'react'

export const DarkTable = (
  {
    data,
    headers = [],
    fields = [],
  }
) => {
  return (
    <table
      style={{
        border: '1px solid white',
        minHeight: 500,
        borderRadius: '15px',
        textAlign: 'center'
      }}
    >
      <header style={{ borderBottom: '1px solid white', margin: '0 30px', padding: 10}}>
        {headers.map(header => <th key={header} style={{ width: 200 }}>{header}</th>)}
      </header>
      <tbody>
        {data && data.map((row, index) => {
          return <tr key={index}>
            {fields.map(field => <td key={field} style={{ width: 200 }}>{row[field]}</td>)}
          </tr>
        })}
      </tbody>
    </table >
  )
}
