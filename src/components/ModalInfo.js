import MUIDataTable from "mui-datatables";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const ModalInfo = ({ showModal, setShowModal, data, nameInfo }) => {
  const [info, setInfo] = useState(nameInfo);

  useEffect(() => {
    setInfo("info: ", nameInfo);
  }, []);

  console.log(data, "data");

  // Untuk tabel Shift
  const dataShift = data.map((item) => [
    item.tanggal,
    item.nama_shift,
    item.nominal_shift,
  ]);
  const columnsDataShift = ["Tanggal", "Nama Shift", "Nominal"];

  // Untuk Tabel Insentif
  const dataInsentif = data.map((item) => [item.tanggal, item.insentif]);
  const columnsDataInsentif = ["Tanggal", "Insentif"];

  // Untuk tabel Denda
  const dataDenda = data.map((item) => [
    item.tanggal,
    item.nama_shift,
    item.denda_telat,
  ]);
  const columnsDataDenda = ["Tanggal", "Nama Shift", "Denda"];

  // Untuk tabel Gaji
  const dataGaji = data.map((item) => [item.tanggal, item.total_gaji]);
  const columnsDataGaji = ["Tanggal", "Gaji"];

  const options = {
    selectableRows: false,
    elevation: 0,
    rowsPerPage: 15,
    rowsPerPageOption: [5, 10],
    filterDate: new Date().toLocaleDateString(),
  };

  let dataTabel = [];
  let columns = [];

  if (nameInfo == "Shift") {
    dataTabel = dataShift;
    columns = columnsDataShift;
  } else if (nameInfo == "Insentif") {
    dataTabel = dataInsentif;
    columns = columnsDataInsentif;
  } else if (nameInfo == "Telat") {
    dataTabel = dataDenda;
    columns = columnsDataDenda;
  } else if (nameInfo == "Gaji") {
    dataTabel = dataGaji;
    columns = columnsDataGaji;
  }
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Detail Info</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <MUIDataTable
                    title={"Data Rekap"}
                    data={dataTabel}
                    columns={columns}
                    options={options}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalInfo;
