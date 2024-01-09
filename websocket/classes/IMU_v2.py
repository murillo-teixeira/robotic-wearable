import serial
import numpy as np
import quaternion
import json  
import time

class IMU():
    def __init__(self, port, baudrate):
        self.ser = serial.Serial(port, baudrate)
        # Flush first reading
        self.ser.readline()
        self.pose = np.zeros(3)

    def update_pose(self):
        read = self.ser.readline().decode().strip().split("\t")
        if len(read) == 4:
            self.pose = np.array(read[-3:], dtype=float)
            return True
        return False 

    def get_pose_json(self):
        return json.dumps({"pitch": self.pose[1], "roll": self.pose[2], "yaw": self.pose[0]})

    def close(self):
        self.ser.close()
