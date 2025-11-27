"use client";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Modal from "./modal";
import EditModal from "./editModal";
import ItemShow from "./itemShow";

interface TodoItem {
  id: string | number;
  title?: string;
  desc?: string;
  description?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Todo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [pagination, setPagination] = useState(0);
  const [isItemShowOpen, setIsItemShowOpen] = useState(false);
  const [itemData, setItemData] = useState<TodoItem | null>(null);

  // const [tabledata, setTabledata] = useState([]);

  const getTodos = async () => {
    const res = await axios.get("http://localhost:4000/tasks", {
      params: {
        skip: pagination,
        take: 5,
        sortBy: "createdAt",
        sort: "asc",
      },
    });

    // setTabledata((prev) => [...prev, ...res.data]);

    return res.data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: () => {
      return getTodos();
    },
  });

  // console.log(tabledata);

  const handleAddTodo = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (formData: {
    title: string;
    description: string;
    status: string;
    priority: string;
  }) => {
    try {
      console.log(formData);
      await axios
        .post("http://localhost:4000/tasks", formData)
        .then((res) => {
          alert("Todo added successfully");
          setIsModalOpen(false);
          refetch();
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
        });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string | number) => {
    try {
      await axios
        .delete(`http://localhost:4000/tasks/${id}`)
        .then((res) => {
          alert("Todo deleted successfully");
          refetch();
        })
        .catch(() => {
          alert("Error deleting todo");
        });
    } catch (error) {
      alert("Error deleting todo");
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditModalSubmit = async (formData: {
    title: string;
    description: string;
    status: string;
    priority: string;
  }) => {
    try {
      await axios
        .patch(`http://localhost:4000/tasks/${editData?.id}`, formData)
        .then(() => {
          alert("Todo edited successfully");
          refetch();
          setIsEditModalOpen(false);
          setEditData(undefined);
        })
        .catch(() => {
          alert("Error editing todo");
        });
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const onScrollEnd = () => {
    setPagination(pagination + 5);
    refetch();
  };

  return (
    <div className="w-full p-4">
      <h1>Todo</h1>
      <div className="flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-end items-center">
          <button
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
            onClick={handleAddTodo}
          >
            Add
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer ml-2"
            onClick={onScrollEnd}
          >
            Paginate {pagination}
          </button>
        </div>

        <div className="w-full overflow-auto max-h-[300px]">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Desc</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Priority</th>
                <th className="border border-gray-300 p-2">createdAt</th>
                <th className="border border-gray-300 p-2">updatedAt</th>
                <th className="border border-gray-300 p-2">edit</th>
                <th className="border border-gray-300 p-2">delete</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 p-4 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 p-4 text-center text-red-500"
                  >
                    Error loading todos
                  </td>
                </tr>
              ) : !data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 p-4 text-center"
                  >
                    No todos found
                  </td>
                </tr>
              ) : (
                data.map((todo: TodoItem) => (
                  <tr key={todo.id}>
                    <td
                      className="border border-gray-300 p-2 cursor-pointer"
                      onClick={() => {
                        setIsItemShowOpen(true);
                        setItemData(todo);
                      }}
                    >
                      {todo.id || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.title || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.desc || todo.description || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.status || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.priority || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.createdAt
                        ? new Date(todo.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {todo.updatedAt
                        ? new Date(todo.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setEditData(todo);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditModalSubmit}
        editData={editData}
      />

      <ItemShow
        isOpen={isItemShowOpen}
        onClose={() => setIsItemShowOpen(false)}
        itemData={itemData}
      />
    </div>
  );
};

export default Todo;
