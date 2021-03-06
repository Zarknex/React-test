import { useState, useEffect, createContext } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";

const MedicinesContext = createContext();

const MedicinesProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [alert, setAlert] = useState({});
  const [medicine, setMedicine] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getMedicines = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axiosClient("/medicines", config);
        setMedicines(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMedicines();
  }, []);

  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert({});
    }, 5000);
  };

  const submitMedicine = async (medicine) => {
    if (medicine.id) {
      await editMedicine(medicine);
    } else {
      await newMedicine(medicine);
    }
  };

  const editMedicine = async (medicine) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.put(
        `/medicines/${medicine.id}`,
        medicine,
        config
      );
      //Sincronizar state
      const updatedMedicines = medicines.map((medicineState) =>
        medicineState._id === data._id ? data : medicineState
      );
      setMedicines(updatedMedicines);
      //Alerta
      setAlert({
        msg: "Medicamento editado correctamente",
        error: false,
      });
      //Redireccionar
      setTimeout(() => {
        setAlert({});
        navigate("/crm/medicines");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const newMedicine = async (medicine) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post("/medicines", medicine, config);
      setMedicines([...medicines, data]);

      setAlert({
        msg: "Medicamento registrado correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/crm/medicines");
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const getMedicine = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient(`/medicines/${id}`, config);
      setMedicine(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const deleteMedicine = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.delete(`/medicines/${id}`, config);

      const updatedMedicine = medicines.filter(
        (medicineState) => medicineState._id !== id
      );
      setMedicines(updatedMedicine);

      setAlert({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/crm");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        showAlert,
        alert,
        submitMedicine,
        getMedicine,
        medicine,
        loading,
        deleteMedicine,
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
};

export { MedicinesProvider };

export default MedicinesContext;
