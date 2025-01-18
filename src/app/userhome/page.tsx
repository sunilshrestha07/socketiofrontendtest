'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {io, Socket} from 'socket.io-client';

interface driverRequestinRideInterface {
  name: string;
  id: string;
  email: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function page() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [driverRequestingRide, setDriverRequestingRide] = useState<driverRequestinRideInterface[]>([]);
  const [acceptedDriver, setAcceptedDriver] = useState<driverRequestinRideInterface>();
  const userID = currentUser?._id;
  const socketRef = useRef<Socket | null>(null)
  const [rideAccepted,setRideAccepted] = useState<boolean>(false);

  const formdata = {
    name: currentUser?.name,
    id: currentUser?._id,
    email: currentUser?.email,
    pickuplocation: {
      latitude: 0,
      longitude: 0,
      name: 'banepa',
    },
    droplocation: {
      latitude: 0,
      longitude: 0,
      name: 'kathmandu',
    },
  };
  // socketiobackendtest-production.up.railway.app

  //useeffect for socket io connection
  useEffect(() => {
    if(!userID) return
    const socket = io('socketiobackendtest-production.up.railway.app', {
      auth: {
        token: userID,
      },
    });

    socketRef.current = socket
    socket.on('findDriver', () => {
      console.log('user searched drivers');
    });

    //this the event trigger by the driver for requesting the user
    socket.on('driverResponse', ({driverData}) => {
      setDriverRequestingRide((prev) => [...prev, driverData]);
      console.log('driver made request to the user');
      // alert('driver made request to the user');
    });

    return () => {
      socket.off('findDriver');
      socket.off('driverResponse');
    };
  }, []); // Add userID as a dependency

  const handelFindDriver = (e: React.FormEvent<HTMLFormElement>) => {
    if(socketRef.current===null) return
    e.preventDefault();
    socketRef.current.emit('findDriver', {formdata});
    console.log('user searched drivers');
  };

  const handelAcceptRequest = (data:driverRequestinRideInterface)=>{
    const driverId = data.id
    if(socketRef.current===null) return
    socketRef.current.emit('AcceptRequest',{formdata,driverId})
    setAcceptedDriver(data)
    setDriverRequestingRide([]);
  }

  const handelCancelRide=(driverId:string)=>{
    if(socketRef.current===null) return
    socketRef.current.emit('CancelRide',{driverId,formdata})
    setDriverRequestingRide([]);
    setAcceptedDriver(undefined)
  }
  return (
    <>
      <div className="">
        {driverRequestingRide &&
          driverRequestingRide.map((item) => (
            <div className="" key={item.id}>
              <p>{item.name}</p>
              <div className="">
                <button onClick={()=>handelAcceptRequest(item)}>Accept</button>
              </div>
            </div>
          ))}

          {acceptedDriver && (
            <div className="">
              <p>{acceptedDriver.name}</p>
              <p>{acceptedDriver.id}</p>
              <p>{acceptedDriver.email}</p>
              <div className="">
                <button onClick={()=>handelCancelRide(acceptedDriver.id)}>cancel ride</button>
              </div>
            </div>
          )}
        <div className="">
          <form onSubmit={handelFindDriver}>
            <h1>Hello user</h1>
            <p>{currentUser?.name}</p>
            <button type='submit'>find driver</button>
          </form>
        </div>
      </div>
    </>
  );
}
