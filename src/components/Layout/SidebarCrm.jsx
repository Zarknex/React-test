import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const SidebarCrm = () => {
  const { auth } = useAuth();

  return (
    <aside className="md:w-80 lg:w-96 px-5 py-10">
      <p className="text-xl font-bold">Hola: {auth.username}</p>
      <Link
        to="create-user"
        className="bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg"
      >
        Crear usuario
      </Link>
    </aside>
  );
};

export default SidebarCrm;