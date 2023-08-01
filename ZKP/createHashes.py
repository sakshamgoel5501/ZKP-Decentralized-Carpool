# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import hashlib


def createHash(a, b, c, d):
    x = bytes.fromhex('00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 '
                      '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 '
                      '00 61')
    hash = hashlib.sha256(x)
    hx = hash.hexdigest()
    print('hx: ', hx)

    hh = bytearray(hash.digest())
    i1 = hh[:16]
    i2 = hh[16:]

    val1 = int.from_bytes(i1, 'big')
    val2 = int.from_bytes(i2, 'big')
    print(val1)
    print(val2)
    print()

    print(hex(val1))
    print(hex(val2))


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    createHash(0, 0, 0, 97)



Proof :

[
    [
      "0x1303666760b6be3a42ba89b46878ba3d66d65d6bc9c5d1af19f67cce2231306e",
      "0x0bab6393712da06feff30b7405b52ec2d0e8c3600a0d4fd2f8873fd069f084a1"
    ],
    [
      [
        "0x0936175c6b2390a9adc440671ba61e6cffa8c1c843507fcdc760f72760a282bc",
        "0x021dd248dc1e060a23d246d052bb6d14d8c8bf23028e0bd48e4475c4cc06909b"
      ],
      [
        "0x0f1bac36854a77264e1d6b90810683a5b34fa3bbcddef9cfcc097c7334d0d716",
        "0x2db6c29f2465c80dd8e714cf48a509167814d4eeb0e393e57623eb91ac07b0c8"
      ]
    ],
    [
      "0x064d3a09edd60b403d5547af7221bc44b487f3fdf5cf373ab54e6b2358380b6e",
      "0x017db7a139ad187c8caa3378e227e7e76418fa8954feaf8bfa1cc64fce497e8d"
    ]
]




Inputs :

[
    "0x0000000000000000000000000000000022192dc09ba3afbc0d0c5b60675ab40b",
    "0x000000000000000000000000000000003f8e08fd3897de4e81a37a4752805f46"
]



a = 0
b = 0
c = 0
d = 97




