import { useState, useEffect, useRef } from "react";
import { useVirtual } from "react-virtual";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getExpandedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import { TableCell } from "./TableCell";
import Spinner from "../Spinner";
import { DebouncedInput } from "../DebouncedInput";
import "./dataTable.css";
import { fakeFetch } from "../API";

export const DataTable = () => {
  const [data, setData] = useState({});
  const [colors, setColors] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [editedRows, setEditedRows] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);

  const columnHelper = createColumnHelper()
  const columns = data?.columns?.map((column, index) => {
    return columnHelper.accessor(column.id, {
      header: column.title,
      cell: TableCell,
      meta: {
        type: column.type,
        columnIndex: index,
        ...(column.type === "select" && {options: [...colors]})
      },
    })
  }) || [];

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const storedData = JSON.parse(localStorage.getItem("tableData"));
      if (storedData !== null) {
        const colors = await fakeFetch("/colors", {});
        setData(storedData);
        setColors(colors);
      } else {
        const [data, colors] = await Promise.all([
          fakeFetch("/data", {
            rows: 100, 
            subRows: 2}),
          fakeFetch("/colors", {})]);
        setData(data);
        setColors(colors);
      }
    } catch (error) {
      // silent error handler
    } finally { 
      setIsLoading(false);
    }
    })()
  }, []);
  
  const updateData = (rowIndex, columnId, value) => {
    setData((prev) => {
      const updatedData = prev.data.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...prev.data[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
      const newData = {
        ...prev,
        data: updatedData,
      };
      localStorage.setItem("tableData", JSON.stringify(newData));
      return newData;
    });
  };

  const table = useReactTable({
    data: data.data || [],
    columns,
    state: {
      columnVisibility,
      globalFilter,
      expanded
    },
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: true,
    meta: {
      editedRows,
      setEditedRows,
      updateData,
    },
  });

  const tableContainerRef = useRef(null);
  const { rows } = table.getRowModel();
  
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <>
      {isLoading && 
        <span className="spinner-cointainer">
          <Spinner />
        </span>}
      
      <div className="table-filter">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={value => setGlobalFilter((value))}
          placeholder="Search all columns..."
        />
        {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id}>
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
      <article ref={tableContainerRef} className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index]
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={table.getCenterLeafColumns().length} align="right" />
            </tr>
          </tfoot>
        </table>
      </article>
    </>    
  );
};