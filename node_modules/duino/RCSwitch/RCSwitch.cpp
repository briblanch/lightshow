/*
  RCSwitch - Arduino libary for remote control outlet switches
  Copyright (c) 2011 Suat ï¿½zgï¿½r.  All right reserved.
  
  Contributors:
  - Andre Koehler / info(at)tomate-online(dot)de
  - Gordeev Andrey Vladimirovich / gordeev(at)openpyro(dot)com
  - Skineffect / http://forum.ardumote.com/viewtopic.php?f=2&t=46
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

#include "RCSwitch.h"

unsigned int RCSwitch::timings[RCSWITCH_MAX_CHANGES];

RCSwitch::RCSwitch() {
  this->nTransmitterPin = -1;
  this->setPulseLength(350);
  this->setRepeatTransmit(10);
  this->setProtocol(1);
}

/**
  * Sets the protocol to send.
  */
void RCSwitch::setProtocol(int nProtocol) {
  this->nProtocol = nProtocol;
  if (nProtocol == 1){
	  this->setPulseLength(350);
  }
  else if (nProtocol == 2) {
	  this->setPulseLength(650);
  }
  Serial.print("Protocol: ");
  Serial.println(nProtocol);
}

/**
  * Sets pulse length in microseconds
  */
void RCSwitch::setPulseLength(int nPulseLength) {
  this->nPulseLength = nPulseLength;
}

/**
 * Sets Repeat Transmits
 */
void RCSwitch::setRepeatTransmit(int nRepeatTransmit) {
  this->nRepeatTransmit = nRepeatTransmit;
}
  

/**
 * Enable transmissions
 *
 * @param nTransmitterPin    Arduino Pin to which the sender is connected to
 */
void RCSwitch::enableTransmit(int nTransmitterPin) {
  this->nTransmitterPin = nTransmitterPin;
  pinMode(this->nTransmitterPin, OUTPUT);
}

/**
  * Disable transmissions
  */
void RCSwitch::disableTransmit() {
  this->nTransmitterPin = -1;
}


/**
* Switch a remote switch on (Type Blah, with 3 outlets per channel)
* @param cChannel 		Code of the channel (A-D) to switch
* @param iOutletNum	Number of the device (1-3) to switch
*/
void RCSwitch::switchOn(char cChannel, int iOutletNum) {
	/*
		"001000" // Dev 1 on
		"000010" // Dev 2 on
		"010000" // Dev 3 on
	*/	
	char* code[3] = { "001000","000010","010000" };
	
	this->send(code[iOutletNum-1], cChannel);
}

/**
* Switch a remote switch off (Type Blah, with 3 outlets per channel)
* @param cChannel 		Code of the channel (A-D) to switch
* @param iOutletNum	Number of the device (1-3) to switch
*/
void RCSwitch::switchOff(char cChannel, int iOutletNum) {
	/*
		"000100" // Dev 1 off
		"000001" // Dev 2 off
		"100000" // Dev 3 off	
	*/	
	char* code[3] = { "000100","000001","100000" };
	
	this->send(code[iOutletNum-1], cChannel);
}

//  @param sChannel 	Code of the channel (A-D) to switch
void RCSwitch::send(char* sCodeWord, char cChannel) {
Serial.print("Sending: ");
Serial.println(sCodeWord);
  for (int nRepeat=0; nRepeat<nRepeatTransmit; nRepeat++) {
    this->sendSync();
    int i = 0;
    while (sCodeWord[i] != '\0') {
      switch(sCodeWord[i]) {
        case '0':
          this->send0();
        break;
        case '1':
          this->send1();
        break;
      }
      i++;
    }
    this->sendEnd(cChannel);
	Serial.println(".");
    delay(10);
  }
}

void RCSwitch::transmit(int nHighPulses, int nLowPulses) {
    if (this->nTransmitterPin != -1) {
	digitalWrite(this->nTransmitterPin, HIGH);
        delayMicroseconds( this->nPulseLength * nHighPulses);
        digitalWrite(this->nTransmitterPin, LOW);
        delayMicroseconds( this->nPulseLength * nLowPulses);
    }
}
/**
 * Sends a "0" Bit
 *                       _    
 * Waveform Protocol 1: | |___
 *                       _  
 * Waveform Protocol 2: | |__
 */
void RCSwitch::send0() {
	if (this->nProtocol == 1){
		this->transmit(1,3);
	}
	else if (this->nProtocol == 2) {
		this->transmit(1,2);
	}
	else if (this->nProtocol == 3) {
		this->transmit(6,18);
		Serial.print("0");
	}
}

/**
 * Sends a "1" Bit
 *                       ___  
 * Waveform Protocol 1: |   |_
 *                       __  
 * Waveform Protocol 2: |  |_
 */
void RCSwitch::send1() {
  	if (this->nProtocol == 1){
		this->transmit(3,1);
	}
	else if (this->nProtocol == 2) {
		this->transmit(2,1);
	}
	else if (this->nProtocol == 3) {
		this->transmit(18,6);
		Serial.print("1");
	}
}


/**
 * Sends a "Sync" Bit
 *                       _
 * Waveform Protocol 1: | |_______________________________
 *                       _
 * Waveform Protocol 2: | |__________
 */
void RCSwitch::sendSync() {

    if (this->nProtocol == 1){
		this->transmit(1,31);
	}
	else if (this->nProtocol == 2) {
		this->transmit(1,10);
	}
	else if (this->nProtocol == 3) {
		this->send0();
		this->send1();
		this->send1();
		this->send0();
		this->send1();
		this->send0();
	}
}

void RCSwitch::sendEnd(char cChannel) {
	if (cChannel == 'A') {
		this->send1();
		this->send0();
		this->send0();
		this->send0();
	}
	if (cChannel == 'B') {
		this->send0();
		this->send1();
		this->send0();
		this->send0();
	}
	if (cChannel == 'C') {
		this->send0();
		this->send0();
		this->send1();
		this->send0();
	}
	if (cChannel == 'D') {
		this->send0();
		this->send0();
		this->send0();
		this->send1();
	}
	if (cChannel == 'E') {
		this->send1();
		this->send1();
		this->send0();
		this->send0();
	}

}