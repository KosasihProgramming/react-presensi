import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { urlAPI } from "../config/global";
import { Link, useParams, useNavigate } from "react-router-dom";
import { konfersiJam } from "../function/konfersiJam";
import Swal from "sweetalert2";

const Pulang = () => {
  const webcamRef = useRef(null);
  const { id_kehadiran } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    dataPulang: [],
    idKehadiran: id_kehadiran,
    barCode: 0,
    idJadwal: 0,
    idDetailJadwal: 0,
    idShift: 0,
    fotoMasuk: "",
    fotoKeluar: "",
    jamMasuk: "",
    jamKeluar: "",
    durasi: 0,
    telat: 0,
    dendaTelat: 0,
    isPindahKlinik: 1,
    lembur: 0,
    namaDokter: "",
    namaShift: "",
    isProses: false,
  });

  useEffect(() => {
    getKehadiran();
    getNamaDokter();
  }, [state.idKehadiran]);

  const getKehadiran = () => {
    axios
      .get(`${urlAPI}/kehadiran/${state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];

        setState((prevState) => ({
          ...prevState,
          barCode: data.barcode,
          idJadwal: data.id_jadwal,
          idDetailJadwal: data.id_detail_jadwal,
          idShift: data.id_shift,
          fotoMasuk: data.foto_masuk,
          fotoKeluar: data.foto_keluar,
          jamMasuk: data.jam_masuk,
          jamKeluar: data.jam_keluar,
          durasi: data.durasi,
          telat: data.telat,
          dendaTelat: data.denda_telat,
          isPindahKlinik: data.is_pindah_klinik,
          lembur: data.lembur,
          namaShift: data.nama_shift,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getNamaDokter = () => {
    axios
      .get(`${urlAPI}/barcode/dokter/${state.idKehadiran}`)
      .then((response) => {
        const dataDokter = response.data[0];

        setState((prevState) => ({
          ...prevState,
          namaDokter: dataDokter.nama,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, isProses: true }));
    const {
      barCode,
      idKehadiran,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoKeluar,
      jamMasuk,
      jamKeluar,
      durasi,
      lembur,
    } = state;

    axios
      .get(`${urlAPI}/kehadiran/${state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];
        const barcodeData = data.barcode;

        console.log(barcodeData, "data Bar");
        console.log(barCode);
        if (barcodeData != `0${barCode}`) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Barcode yang dimasukkan tidak sesuai",
          }).then((result) => {
            if (result.value) {
              setState((prevState) => ({ ...prevState, isProses: false }));
            }
          });
        } else {
          const fotoKeluar = webcamRef.current.getScreenshot();
          const waktuSekarang = new Date(); //jam pulang
          const jamKeluar = konfersiJam(waktuSekarang.toLocaleTimeString());

          axios
            .patch(`${urlAPI}/kehadiran/${idKehadiran}`, {
              foto_keluar: fotoKeluar,
              jam_masuk: state.jamMasuk,
              jam_keluar: jamKeluar,
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Berhasil melakukan presensi pulang",
              }).then((result) => {
                if (result.value) {
                  navigate("/kehadiran"); // Pindah ke halaman utama atau rute lain
                }
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan data",
              });
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="card-presensi">
        <div className="rounded-lg bg-white shadow-lg">
          <div className="grid grid-cols-2">
            <div className="flex p-10 h-[70vh] justify-center items-center">
              <Webcam
                className="rounded-3xl"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="title">Presensi pulang</h4>
              <p className="text-xl">
                Nama Dokter:{" "}
                <span className="font-bold">{state.namaDokter}</span>
              </p>
              <p className="text-xl mb-5">
                Shift: <span className="font-bold">{state.namaShift}</span>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 w-[60%]">
                  <input
                    type="number"
                    onChange={(e) =>
                      setState({ ...state, barCode: e.target.value })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                  <div className="flex flex-row gap-4">
                    <Link
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                      to={"/kehadiran"}
                    >
                      Batal
                    </Link>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      disabled={state.isProses}
                    >
                      Pulang
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pulang;
