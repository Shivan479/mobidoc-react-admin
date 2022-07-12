import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Col,
  Row,
  Button,
  Dropdown,
  ButtonGroup,
  Table,
  Alert,
  Card,
  Image,
} from "@themesberg/react-bootstrap";
import Notiflix from "notiflix";

import { APIService } from "../api.service";
import { setUsersList } from "../slices/usersSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  const users = useSelector((state) => state.users);

  const getUsers = () => {
    console.log({
      username: login.email,
      password: atob(sessionStorage.pwd),
    });
    APIService.get("list-users", {
      params: {
        // "single": false,
        // "withBranches": false
      },
    }).then((response) => {
      // dispatch(setHolidaysList(response.data));
      dispatch(setUsersList(response.data.users));
    });
  };

  const enableOrDisable = (id, enableOrDisable) => {
    Notiflix.Confirm.show(
      `${!enableOrDisable ? "Enable" : "Disable"} Doctor/User`,
      `Are you sure to ${
        !enableOrDisable ? "Enable" : "Disable"
      } this Doctor/User`,
      "Yes",
      "Cancel",
      () => {
        APIService.post("enable-disable", { id: id }).then((response) => {
          Notiflix.Notify.success(response.data.message);
          getUsers();
        });
      }
    );
  };

  const deleteDoctorUser = (id) => {
    Notiflix.Confirm.show(
      `Delete Doctor`,
      `Are you sure to this Account?`,
      "Yes",
      "Cancel",
      () => {
        APIService.post("delete-doctor", { id: id }).then((response) => {
          Notiflix.Notify.success(response.data.message);
          getUsers();
        });
      }
    );
  };

  useEffect(() => {
    getUsers();

    return () => {
      // second
    };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h4>Users</h4>
      </div>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <Button variant="success" onClick={getUsers}>
            Refresh
          </Button>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <td>ID</td>
                <td>Detials</td>
                <td>TYPE</td>
                <td>Created</td>
                <td>SocketID</td>
                <td>Actions</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {users.users.map((user, index) => {
                if (user.username == "himan.verma") {
                  return <></>;
                }
                return (
                  // <tr>{JSON.stringify(user)}</tr>
                  <tr>
                    <td>{user.id}</td>
                    <td>
                      <Image
                        src={user.profile_pic}
                        height={60}
                        style={{ float: "left", paddingRight: "5px" }}
                      />
                      <span>
                        {user.profile && (
                          <>
                            <b>{user.profile.fullname}</b>
                            <br />
                          </>
                        )}
                        {user.email}
                        <br />
                        Username: {user.username}
                      </span>
                    </td>
                    <td>
                      {user.profile ? (
                        <>Doctor</>
                      ) : (
                        <>
                          {user.username == "webieapp"
                            ? "ADMIN"
                            : "Normal User"}
                        </>
                      )}
                    </td>
                    <td>{user.created_at}</td>
                    <td>{user.socket_id}</td>
                    <td>
                      {user.enabled == 1 ? (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => {
                              enableOrDisable(user.id, user.enabled);
                            }}
                          >
                            Disable
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="success"
                            onClick={() => {
                              enableOrDisable(user.id, user.enabled);
                            }}
                          >
                            Enable
                          </Button>
                        </>
                      )}
                      {user.role != 'admin' && (
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteDoctorUser(user.id);
                          }}
                        >
                          DELETE
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};
export default UsersList;
