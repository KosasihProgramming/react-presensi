import axios from "axios";
import { Component } from "react";
import { urlAPI } from "../config/Global";
import { differenceInDays, eachDayOfInterval, formatDate } from "date-fns";
import MUIDataTable from "mui-datatables";
import Swal from "sweetalert2";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import "../style/jadwal.css";
import LoadingAnimation from "../components/Loading";
import { FaArrowRight } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";
import ModalInfo from "../components/ModalInfo";
import { HiOutlineSelector } from "react-icons/hi";

class RekapGajiPeriodePerawat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: new Date().getFullYear(),
      selectedMonth: "",
    };
  }

  handleYearChange = (e) => {
    this.setState({ selectedYear: parseInt(e.target.value) });
  };

  handleMonthChange = (select) => {
    this.setState({ selectedMonth: select.value, bulan: select.label });
  };

  render() {
    return (
      <>
        <div className="container mx-auto mb-16">
          <div className="rounded-lg bg-white shadow-lg my-5">
            <div className="flex flex-col p-10">
              <h4 className="text-black font-bold text-xl">
                Cari Rekapan Per Periode
              </h4>
              <br />
              <hr />
              <br />
              <div className="flex">
                <form action="" className=" w-full">
                  <div className="flex flex-row items-center gap-10">
                    <Form.Group className="form-field">
                      <Form.Label className="label-text">
                        Pilih Bulan:
                      </Form.Label>

                      <select
                        className="bulan-field"
                        id="monthDropdown"
                        // onChange={(e) =>
                        //   this.handleMonthChange(
                        //     months.find(
                        //       (month) => month.value === e.target.value
                        //     )
                        //   )
                        // }
                        value={this.state.selectedMonth}>
                        <option value="">Pilih</option>
                        {/* {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))} */}
                      </select>
                    </Form.Group>

                    <Form.Group className="form-field">
                      <Form.Label className="label-text">
                        Pilih Tahun:
                      </Form.Label>

                      <select
                        className="bulan-field"
                        id="yearDropdown"
                        // onChange={this.handleYearChange}
                        // value={this.state.selectedYear}
                      >
                        {/* {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))} */}
                      </select>
                    </Form.Group>
                    <div
                      className="flex flex-row"
                      style={{ gap: "1rem", marginTop: "0" }}>
                      <div
                        className="btn-group"
                        style={{
                          marginTop: "0",
                          paddingTop: "0",
                          alignItems: "center",
                        }}>
                        <button
                          type="submit"
                          className="btn-input custom-btn btn-15"
                          onClick={this.handleSearch}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}>
                          <div className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="2rem"
                              height="2rem"
                              viewBox="0 0 24 24">
                              <g fill="none" stroke="white" stroke-width="2">
                                <circle cx="11" cy="11" r="7" />
                                <path stroke-linecap="round" d="m20 20l-3-3" />
                              </g>
                            </svg>
                          </div>
                          Cari Data
                        </button>

                        <button
                          type="submit"
                          className="btn-input custom-btn btn-15"
                          // onClick={this.handleFilterPengganti}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}>
                          <div className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="2rem"
                              height="2rem"
                              viewBox="0 0 24 24">
                              <g fill="none" stroke="white" stroke-width="2">
                                <circle cx="11" cy="11" r="7" />
                                <path stroke-linecap="round" d="m20 20l-3-3" />
                              </g>
                            </svg>
                          </div>
                          Dr Pengganti
                        </button>

                        <button
                          type="submit"
                          className="btn-input custom-btn btn-15"
                          // onClick={this.handleExport}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}>
                          <div className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="2rem"
                              height="2rem"
                              viewBox="0 0 256 256">
                              <g fill="white">
                                <path d="M208 88h-56V32Z" opacity="0.2" />
                                <path d="M48 180c0 11 7.18 20 16 20a14.24 14.24 0 0 0 10.22-4.66a8 8 0 0 1 11.56 11.06A30.06 30.06 0 0 1 64 216c-17.65 0-32-16.15-32-36s14.35-36 32-36a30.06 30.06 0 0 1 21.78 9.6a8 8 0 0 1-11.56 11.06A14.24 14.24 0 0 0 64 160c-8.82 0-16 9-16 20m79.6-8.69c-4-1.16-8.14-2.35-10.45-3.84c-1.25-.81-1.23-1-1.12-1.9a4.57 4.57 0 0 1 2-3.67c4.6-3.12 15.34-1.73 19.83-.56a8 8 0 0 0 4.14-15.48c-2.12-.55-21-5.22-32.84 2.76a20.58 20.58 0 0 0-9 14.95c-2 15.88 13.65 20.41 23 23.11c12.06 3.49 13.12 4.92 12.78 7.59c-.31 2.41-1.26 3.34-2.14 3.93c-4.6 3.06-15.17 1.56-19.55.36a8 8 0 0 0-4.31 15.44a61.34 61.34 0 0 0 15.19 2c5.82 0 12.3-1 17.49-4.46a20.82 20.82 0 0 0 9.19-15.23c2.19-17.31-14.32-22.14-24.21-25m83.09-26.84a8 8 0 0 0-10.23 4.84L188 184.21l-12.47-34.9a8 8 0 0 0-15.07 5.38l20 56a8 8 0 0 0 15.07 0l20-56a8 8 0 0 0-4.84-10.22M216 88v24a8 8 0 0 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88m-27.31-8L160 51.31V80Z" />
                              </g>
                            </svg>
                          </div>
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-lg">
            <div className="flex flex-col p-10">
              <MUIDataTable
                title={"Data Rekap Dokter Gigi"}
                // data={listDokterGigi}
                // columns={columnsDokterGigi}
                // options={options}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default RekapGajiPeriodePerawat;
