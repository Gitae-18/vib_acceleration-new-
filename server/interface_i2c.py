from smbus2 import SMBus, i2c_msg

class interface_i2c:
    def __init__(self, i2c_port, slave_addr):
        self.i2c = SMBus(i2c_port) # 0 or 1
        self._dev_id = slave_addr 

    def open(self):
        None

    def close(self):
        None

    def write_data(self, address, value):
        try:
            self.i2c.write_byte_data(self._dev_id, address, value);
        except:
            print('write error')

    def read_data(self, address):
        try:
            return self.i2c.read_byte_data(self._dev_id, address);
        except:
            print('read error')

    def write_datas(self, address, values):
        try:
            self.i2c.write_i2c_block_data(self._dev_id, address, values)
        except IOError:
            print('write error')

    def read_datas(self, address, length):
        try:
            return self.i2c.read_i2c_block_data(self._dev_id, address, length)
        except:
            print('read error')
