import React, { useEffect, useState } from "react";
import SingleTask from "./SingleTask";
import { Center, Container, Heading, List } from "@chakra-ui/react";
import Axios from "axios";
import { UserState } from "../Context/UserProvider";

const Tasks = () => {
  const { user, tasks, setTasks } = UserState();

  useEffect(() => {
    // Function to fetch all tasks
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await Axios.get("api/v1/users/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Fetch tasks when the component mounts
  }, [user]);

  const deleteTask = async (taskId) => {
    console.log("task id", taskId);
    try {
      const response = await Axios.delete(`api/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (taskId, newData) => {
    try {
      const response = await Axios.put(
        `api/v1/tasks/update/${taskId}`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...newData } : task
          )
        );
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const markTaskAsDone = async (taskId) => {
    try {
      const response = await Axios.patch(
        `api/v1/tasks/update/${taskId}/done`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, done: true } : task
          )
        );
      }
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const markTaskAsUndone = async (taskId) => {
    try {
      const response = await Axios.patch(
        `api/v1/tasks/update/${taskId}/undone`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, done: false } : task
          )
        );
      }
    } catch (error) {
      console.error("Error marking task as undone:", error);
    }
  };

  return (
    <Center
      m={4}
      mt={0}
      bgColor={"white"}
      borderRadius={"md"}
      p={4}
      h={"60%"}
      overflow={"scroll"}
    >
      <List h={"100%"}>
        {tasks.map((task) => (
          <SingleTask
            key={task._id}
            task={task}
            onDelete={() => deleteTask(task._id)}
            onEdit={(newData) => editTask(task._id, newData)}
            onMarkDone={() => markTaskAsDone(task._id)}
            onMarkUndone={() => markTaskAsUndone(task._id)}
          />
        ))}
      </List>
    </Center>
  );
};

export default Tasks;
