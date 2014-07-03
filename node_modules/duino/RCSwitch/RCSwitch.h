/*
  RCSwitch - Arduino libary for remote control outlet switches
  Copyright (c) 2011 Suat ï¿½zgï¿½r.  All right reserved.

  Contributors:
  - Andre Koehler / info(at)tomate-online(dot)de
  - Gordeev Andrey Vladimirovich / gordeev(at)openpyro(dot)com
  - Dominik Fischer / dom_fischer(at)web(dot)de
  
  Project home: http://code.google.com/p/rc-switch/

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
#ifndef _RCSwitch_h
#define _RCSwitch_h

#if defined(ARDUINO) && ARDUINO >= 100
    #include "Arduino.h"
#else
    #include "WProgram.h"
#endif

// Number of maximum High/Low changes per packet.
// We can handle up to (unsigned long) => 32 bit * 2 H/L changes per bit + 2 for sync
#define RCSWITCH_MAX_CHANGES 67

class RCSwitch {

  public:
    RCSwitch();
    
    void switchOn(char cChannel, int iOutletNum);
    void switchOff(char cChannel, int iOutletNum);
    void send(char* sCodeWord, char cChannel);
    void enableTransmit(int nTransmitterPin);
    void disableTransmit();
    void setPulseLength(int nPulseLength);
    void setRepeatTransmit(int nRepeatTransmit);
    void setProtocol(int nProtocol);
    
  private:
    void send0();
    void send1();
    void sendSync();
    void sendEnd(char cChannel);
    void transmit(int nHighPulses, int nLowPulses);

    int nTransmitterPin;
    int nPulseLength;
    int nRepeatTransmit;
    char nProtocol;

    static unsigned int timings[RCSWITCH_MAX_CHANGES];   
};

#endif