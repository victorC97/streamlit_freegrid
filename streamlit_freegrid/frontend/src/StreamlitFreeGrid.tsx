import {
  ArrowTable,
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import {Box} from "@mui/material";
import {DataGrid, GridColDef, GridColumnVisibilityModel, GridRowId, GridValueGetterParams} from '@mui/x-data-grid';

interface State {
}

interface Data {
  columns: GridColDef[],
  rows: object[],
  columnVisibility: GridColumnVisibilityModel
}

interface TypeData {
  type: string
  options?: object
  lang?: string
}

const html_image = (src: string, height: number, width: number, name: string, i: GridRowId | undefined) => {
  const alt: string = `image_${name}_${(i !== undefined)? i.toString():"null"}`
  return (
    <img alt={alt} src={src} height={height} width={width}/>
  )
}

const getDataGridInfos = (df: ArrowTable, labels: object, hide: string[], types: object) => {
  const data: Data = {columns: [], rows: [], columnVisibility: {}}
  const n = df.rows
  const p = df.columns
  const regex: RegExp = new RegExp("[0-9]+")
  data.columns.push({field: "id", headerName: "id", flex: 1, editable: false,})
  data.columnVisibility["id"] = false
  // generate columns data
  for (let j = 1; j < p ; j++) {
    const columnCell = df.getCell(0, j)
    let field: string = (columnCell.content !== null && columnCell.content !== "")? columnCell.content.toString(): j.toString()
    let headerName: string
    if (field === "id") {
      field = "_id"
      headerName = "_id"
    }
    // headerName from labels props
    if (Object.keys(labels).includes(field)) {
      headerName = labels[field as keyof object]
    } else {
      headerName = field
    }
    // generate column
    const columnData: GridColDef = {field: field, headerName: headerName, flex: 1, editable: false,}
    if (Object.keys(types).includes(field)) {
      const typeData: TypeData = types[field as keyof object]
      switch (typeData.type) {
        case "image":
          columnData["renderCell"] = params => (<img alt={(params.id !== undefined)? headerName+params.id.toString(): headerName+"null"} src={params.value} height="100%"/>)
          break
        case "date":
          columnData["valueFormatter"] = params => new Date(params?.value * 1000000).toLocaleString(typeData.lang, typeData.options)
          break
      }
    }
    data.columns.push(columnData)
    // hide columns from hide props
    data.columnVisibility[field] = !(regex.test(field) || hide.includes(field))
  }
  // generate rows data
  for (let i = 1; i < n; i++) {
    const row: any = {}
    row["id"] = i
    for (let j = 1; j < p; j++) {
      row[data.columns[j].field] = df.getCell(i, j).content
    }
    data.rows.push(row)
  }
  console.log(data)
  return data
}

class StreamlitFreeGrid extends StreamlitComponentBase<State> {
  public state: State = {}
  private df: ArrowTable = this.props.args["df"]
  private height: number = this.props.args["height"]
  private pageSize: number = this.props.args["pageSize"]
  private labels: object = this.props.args["labels"]
  private hide: string[] = this.props.args["hide"]
  private types: object = this.props.args["types"]

  public render = (): ReactNode => {
    const data = getDataGridInfos(this.df, this.labels, this.hide, this.types)
    return (
      <Box
        sx={{
          height: this.height,
          width: "100%",
        }}
      >
        <DataGrid
          initialState={{
            columns: {columnVisibilityModel: data.columnVisibility}
          }}
          columns={data.columns}
          rows={data.rows}
          pageSize={this.pageSize}
          disableSelectionOnClick/>
      </Box>
    )
  }
}

export default withStreamlitConnection(StreamlitFreeGrid)
