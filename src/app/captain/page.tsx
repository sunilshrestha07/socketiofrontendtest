'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {io,Socket} from 'socket.io-client';

interface userSearchingDriverInterface {
  name: string;
  id: string;
  email: string;
  pickuplocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  droplocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export default function page() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const socketRef = useRef<Socket | null>(null)
  const driverId = currentUser?._id;

  //define the driver data
  const driverData={
    name:currentUser?.name,
    id:currentUser?._id,
    email:currentUser?.email,
    location:{
      latitude:0,
      longitude:0,
    }
  }
  const [userSearchingRide, setUserSearchingRide] = useState<userSearchingDriverInterface[]>([]);

  //useeffect for socket io connection
  useEffect(() => {
    if (!driverId) return;
    const socket = io('socketiobackendtest-production.up.railway.app', {
      auth: {
        drivertoken: driverId,
      },
    });
    socketRef.current = socket;
    socket.on('broadCastDrives', ({formdata}) => {
      // if(currentDriverVehcilceType !== formdata.formdata.name) return
      setUserSearchingRide((prev) => [...prev, formdata.formdata]);
      console.log('requesting user is',formdata.formdata);
    });

    socket.on('rideAccepted', ({formdata}) => {
      alert(`ride accepted by user ${formdata.name}`);
      console.log('ride accepted by user ', formdata);

    });

    socket.on('terminateFindDriverRequest', ({formdata}) => {
      setUserSearchingRide((filtered) => filtered.filter((data) => data.id !== formdata.id));
    });

    socket.on('rideHasBeenCancled', ({formdata}) => {
      alert(`ride has been calcled by user ${formdata.name} has canceled the ride`);
    });
    return () => {
      socket.off('broadCastDrives');
      socket.off('requestRideToUser');
      socket.off('rideAccepted');
      socket.off('rideHasBeenCancled');
    };
  }, []);

  const handelRequestRide = (userId: string) => {
    if(socketRef.current===null) return
    socketRef.current.emit('requestRideToUser', {driverData, userId});
    console.log('made request to user', userId);

  };
  return (
    <>
      <div className="">
        {userSearchingRide && userSearchingRide.map((data) => (
          <div key={data.id}>
            <p>{data.name}</p>
            <div className="">
              <button onClick={()=>handelRequestRide(data.id)}>Request Ride</button>
            </div>
          </div>
        ))}
        <div className="">
          <h1>Hello captain</h1>
          <p>{currentUser?.name}</p>
          {/* <button onClick={handelRequestRide}>request ride</button> */}
        </div>
      </div>
    </>
  );
}
