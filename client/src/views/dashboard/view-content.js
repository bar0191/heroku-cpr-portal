import React from 'react';
import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {Table, Th, Thead} from 'reactable';
import {
    CardGroup, Card, CardBlock, CardTitle, Row,
    Button, ButtonGroup, CardDeck, Col,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, FormText, FormFeedback,
    InputGroup, InputGroupAddon, InputGroupButton
} from 'reactstrap';
import {
  BootstrapTable, TableHeaderColumn
} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

import CircularProgressbar from 'react-circular-progressbar';


// MainDashboard Class Component
class CodeBlueDash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currLocIds: [],
      update: [],
      dataKey: [],
      watchDataKey: [],
      avg: [],
      modal: false,
      dropdownICUOpen: false,
      w1DropdownOpen: false,
      w2DropdownOpen: false,
      w3DropdownOpen: false,
      w4DropdownOpen: false,
      w5DropdownOpen: false,
      totalPauses: [],
      pumps: [],
      pumpChart: [],
      currDevicePos: 0,
      currSessionPos: 0,
      currLocPos: [],
      alertVisible: false,
      totalPumps: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.onDropDownClick = this.onDropDownClick.bind(this);
    this.handleW1Toggle = this.handleW1Toggle.bind(this);
    this.handleW2Toggle = this.handleW2Toggle.bind(this);
    this.handleW3Toggle = this.handleW3Toggle.bind(this);
    this.handleW4Toggle = this.handleW4Toggle.bind(this);
    this.handleW5Toggle = this.handleW5Toggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDRBtnClick = this.onDRBtnClick.bind(this);
    this.onPRBtnClick = this.onPRBtnClick.bind(this);
    this.handleICUToggle = this.handleICUToggle.bind(this);
    this.handlePrevNext = this.handlePrevNext.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    fetch(`api/getLatestMICUId`, {accept: 'application/json'})
      .then((response) => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json});
      })
      .then((data) => {
        this.initData(data);
      });
      fetch(`api/getMICUIds`, {accept: 'application/json'})
        .then((response) => {
          if(!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((json) => {
          this.setState({currLocIds: json});
          this.setState({currLocPos: this.state.currLocIds.length - 1});
      });
  }

  initData(data) {
    {this.state.data.map(function(m, i) {
          var sum = 0; var totSessions = 0;
          var avg = 0; var dAvg = 0;
          var data = []; var totPumps = 0;
          var obj = {};
          var pDepthData = []; var pData = [];
          var pDepthObj = {};  var pObj = {};

          for (i = 0; i < 5; i++) {
            if (m.devices[i].SessionCount > 1) {
              for (let j = 0; j < m.devices[i].SessionCount; j++) {
                sum += m.devices[i].SessionData[j].Pauses;
                avg += m.devices[i].SessionData[j].AverageDepth;
                dAvg += m.devices[i].SessionData[j].AverageDepth;
                totPumps += m.devices[i].SessionData[j].TotalPumps;
              }
              dAvg /= m.devices[i].SessionCount
              obj = {name: m.devices[i].deviceID, depth: dAvg};
              data.push(obj);
              totSessions += m.devices[i].SessionCount
              dAvg = 0;
            }
            else {
              sum += m.devices[i].SessionData[0].Pauses;
              avg += m.devices[i].SessionData[0].AverageDepth;
              totPumps += m.devices[i].SessionData[0].TotalPumps;
              obj = {name: m.devices[i].deviceID, depth: m.devices[i].SessionData[0].AverageDepth};
              data.push(obj);
              totSessions += 1;
            }
          }
          this.managePumps(0,0,m);
          avg /= totSessions;
          return (this.setState({
              update: data,
              dataKey: 'depth',
              watchDataKey: 'depth',
              totalPauses: sum,
              avg: avg.toFixed(2)+" in",
              totalPumps: totPumps,
              alertVisible: false,
              currDevicePos: 0,
              currSessionPos: 0
            }));
        }, this)}
  }

  managePumps(dPos, sPos, m) {
    this.setState({watchDataKey: 'depth'});
    var pDepthData = []; var pData = [];
    var pDepthObj = {};  var pObj = {};

    for (let i = 0; i < m.devices[dPos].SessionData[sPos].TotalPumps; i++) {
      if (m.devices[dPos].SessionData[sPos].pumps[i].depth > 1.90) {
        pDepthObj = {
          no: i+1,
          depth: m.devices[dPos].SessionData[sPos].pumps[i].depth
          };
      }
      else {
        pDepthObj = {
          no: i+1,
          depth2: m.devices[dPos].SessionData[sPos].pumps[i].depth
          };
      }
      pDepthData.push(pDepthObj);
    }
    for (let i = 0; i < m.devices[dPos].SessionData[sPos].TotalPumps; i++) {
      pObj = {
        no: i+1,
        depth: m.devices[dPos].SessionData[sPos].pumps[i].depth,
        ts_index: m.devices[dPos].SessionData[sPos].pumps[i].ts_index,
        start_ts: m.devices[dPos].SessionData[sPos].pumps[i].start_ts,
        end_ts: m.devices[dPos].SessionData[sPos].pumps[i].end_ts,
        pumpStart: m.devices[dPos].SessionData[sPos].pumps[i].pumpStart,
        pumpEnd: m.devices[dPos].SessionData[sPos].pumps[i].pumpEnd,
        recoil: m.devices[dPos].SessionData[sPos].pumps[i].recoil
      }
      pData.push(pObj);
    }
    return (this.setState({pumpChart: pDepthData, pumps: pData}))
  }

  manageRecoil(dPos, sPos, m) {
    this.setState({watchDataKey: 'recoil'});
    var rData = []; var rObj = {};

    for (let i = 0; i < m.devices[dPos].SessionData[sPos].TotalPumps; i++) {
      rObj = {
        no: i+1,
        recoil: m.devices[dPos].SessionData[sPos].pumps[i].recoil
      };
      rData.push(rObj);
    }
    return (this.setState({pumpChart: rData}));
  }

  handlePrevNext(mSelected) {
    this.setState({ mSelected });
    var pos = this.state.currLocPos;

    if (mSelected === 1) {
      if (pos === 0) {
        return(this.setState({ alertVisible: true }));
      }
      this.setState({ currLocPos: this.state.currLocPos - 1})
      pos = pos - 1;
      this.handleDocChange(pos);
      return(this.setState({ alertVisible: false }));
    }
    else {
      if (pos === (this.state.currLocIds.length-1)) {
        return(this.setState({ alertVisible: true }));
      }
      this.setState({ currLocPos: this.state.currLocPos + 1 })
      pos = pos + 1;
      this.handleDocChange(pos);
      return(this.setState({ alertVisible: false }));
    }
  }

  handleDocChange(pos) {
    fetch(`api/getById/`+this.state.currLocIds[pos].id, {accept: 'application/json'})
      .then((response) => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json});
      })
      .then((data) => {
        this.initData(data);
      });

  }

  onDismiss() {
    this.setState({ alertVisible: false });
  }

  toggle(wSelected, m) {
    this.setState({ wSelected });
    this.setState({ bSelected: 1});

    switch(wSelected) {
      case 0:
        this.setState({ currDevicePos: 0, currSessionPos: 0 });
        this.managePumps(wSelected, 0, m);
        break;
      case 1:
        this.setState({ currDevicePos: 1, currSessionPos: 0  });
        this.managePumps(wSelected, 0, m);
        break;
      case 2:
        this.setState({ currDevicePos: 2, currSessionPos: 0  });
        this.managePumps(wSelected, 0, m);
        break;
      case 3:
        this.setState({ currDevicePos: 3, currSessionPos: 0  });
        this.managePumps(wSelected, 0, m);
        break;
      case 4:
        this.setState({ currDevicePos: 4, currSessionPos: 0  });
        this.managePumps(wSelected, 0, m);
        break;
    }
  }

  toggleModal() {
    this.setState({modal: !this.state.modal});
  }

  handleSessionToggle(dPos, sPos, m) {
    this.setState({bSelected: 1});

    switch(dPos) {
      case 0:
        this.setState({ currDevicePos: 0, currSessionPos: sPos });
        this.managePumps(dPos, sPos, m);
        break;
      case 1:
        this.setState({ currDevicePos: 1, currSessionPos: sPos  });
        this.managePumps(dPos, sPos, m);
        break;
      case 2:
        this.setState({ currDevicePos: 2, currSessionPos: sPos  });
        this.managePumps(dPos, sPos, m);
        break;
      case 3:
        this.setState({ currDevicePos: 3, currSessionPos: sPos  });
        this.managePumps(dPos, sPos, m);
        break;
      case 4:
        this.setState({ currDevicePos: 4, currSessionPos: sPos  });
        this.managePumps(dPos, sPos, m);
        break;
    }
  }

  handleChange(date) {
    this.setState({startDate: date});
  }

  handleICUToggle() {
    this.setState({dropdownICUOpen: !this.state.dropdownICUOpen});
  }

  handleW1Toggle() {
    this.setState({ w1DropdownOpen: !this.state.w1DropdownOpen});
  }

  handleW2Toggle() {
    this.setState({ w2DropdownOpen: !this.state.w2DropdownOpen});
  }

  handleW3Toggle() {
    this.setState({ w3DropdownOpen: !this.state.w3DropdownOpen});
  }

  handleW4Toggle() {
    this.setState({ w4DropdownOpen: !this.state.w4DropdownOpen});
  }

  handleW5Toggle() {
    this.setState({ w5DropdownOpen: !this.state.w5DropdownOpen});
  }

  onDropDownClick(lSelected) {
    this.setState({ lSelected });
    this.setState({bSelected: 1});
    this.setState({rSelected: 2});

    if (lSelected === 1) {
      fetch(`api/getLatestMICUId`, {accept: 'application/json'})
        .then((response) => {
          if(!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((json) => {
          this.setState({data: json});
        })
        .then((data) => {
          this.initData(data);
        });
        fetch(`api/getMICUIds`, {accept: 'application/json'})
          .then((response) => {
            if(!response.ok) {
              throw Error(response.statusText);
            }
            return response;
          })
          .then((response) => response.json())
          .then((json) => {
            this.setState({currLocIds: json});
            this.setState({currLocPos: this.state.currLocIds.length - 1});
          });
    }
    else {
      fetch(`api/getLatestSICUId`, {accept: 'application/json'})
        .then((response) => {
          if(!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((json) => {
          this.setState({data: json});
        })
        .then((data) => {
          this.initData(data);
        });
        fetch(`api/getSICUIds`, {accept: 'application/json'})
          .then((response) => {
            if(!response.ok) {
              throw Error(response.statusText);
            }
            return response;
          })
          .then((response) => response.json())
          .then((json) => {
            this.setState({currLocIds: json});
            this.setState({currLocPos: this.state.currLocIds.length - 1});
          });
    }
  }

  onDRBtnClick(rSelected) {
    this.setState({ rSelected });
    {this.state.data.map(function(m, i) {
      var avg = 0;   var dAvg = 0;
      var data = []; var rAvg = 0;
      var obj = {};  var totSessions = 0;

      if (rSelected === 1) {
        for (i = 0; i < 5; i++) {
          if (m.devices[i].SessionCount > 1) {
            for (var j = 0; j < m.devices[i].SessionCount; j++) {
              avg += m.devices[i].SessionData[j].AverageRate;
              rAvg += m.devices[i].SessionData[j].AverageRate;
            }
            rAvg /= m.devices[i].SessionCount
            obj = {name: m.devices[i].deviceID, rate: m.devices[i].SessionData[0].AverageRate};
            data.push(obj);
            rAvg = 0;
            totSessions += m.devices[i].SessionCount;
          }
          else {
            avg += m.devices[i].SessionData[0].AverageRate;
            obj = {name: m.devices[i].deviceID, rate: m.devices[i].SessionData[0].AverageRate};
            data.push(obj);
            totSessions += 1;
          }
        }
        avg /= totSessions;
        totSessions = 0;
        return (this.setState({update: data, dataKey: 'rate', avg: avg.toFixed(2)+" bpm"}));
      }
      else {
        for (i = 0; i < 5; i++) {
          if (m.devices[i].SessionCount > 1) {
            for (var j = 0; j < m.devices[i].SessionCount; j++) {
              avg += m.devices[i].SessionData[j].AverageDepth;
              dAvg += m.devices[i].SessionData[j].AverageDepth;
            }
            dAvg /= m.devices[i].SessionCount
            obj = {name: m.devices[i].deviceID, depth: m.devices[i].SessionData[0].AverageDepth};
            data.push(obj);
            dAvg = 0;
            totSessions += m.devices[i].SessionCount;
          }
          else {
            avg += m.devices[i].SessionData[0].AverageDepth;
            obj = {name: m.devices[i].deviceID, depth: m.devices[i].SessionData[0].AverageDepth};
            data.push(obj);
            totSessions += 1;
          }
        }
        avg /= totSessions;
        totSessions = 0;
        return (this.setState({update: data, dataKey: 'depth', avg: avg.toFixed(2)+" in"}));
      }
    }, this)}
  }

  onPRBtnClick(bSelected, m) {
    this.setState({ bSelected });

    if (bSelected === 1) {
      this.managePumps(this.state.currDevicePos, this.state.currSessionPos, m);
    }
    else {
      this.manageRecoil(this.state.currDevicePos, this.state.currSessionPos, m);
    }
  }

  WatchOneButton(m) {
    let SessionDropdown = [];

    for (let i = 0; i < m.devices[0].SessionCount; i++) {
      SessionDropdown.push(
        <DropdownItem key={i} onClick={() => this.handleSessionToggle(0, i, m)}>
          Session {i+1}
        </DropdownItem>);
    }

    return(
      <CardBlock >
          <ButtonDropdown isOpen={this.state.w1DropdownOpen} toggle={this.handleW1Toggle}>
            <Button id="caret" size="sm" color="primary" onClick={() => this.toggle(0, m)}>
              {m.devices[0].deviceID}
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              {SessionDropdown}
            </DropdownMenu>
          </ButtonDropdown>
      </CardBlock>
    );
  }

  WatchTwoButton(m) {
    let SessionDropdown = [];

    for (let i = 0; i < m.devices[1].SessionCount; i++) {
      SessionDropdown.push(
        <DropdownItem key={i}  onClick={() => this.handleSessionToggle(1, i, m)}>
          Session {i+1}
        </DropdownItem>);
    }

    return(
      <CardBlock >
          <ButtonDropdown isOpen={this.state.w2DropdownOpen} toggle={this.handleW2Toggle}>
            <Button id="caret" size="sm" color="primary" onClick={() => this.toggle(1, m)}>
              {m.devices[1].deviceID}
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              {SessionDropdown}
            </DropdownMenu>
          </ButtonDropdown>
      </CardBlock>
    );
  }

  WatchThreeButton(m) {
    let SessionDropdown = [];

    for (let i = 0; i < m.devices[2].SessionCount; i++) {
      SessionDropdown.push(
        <DropdownItem key={i} onClick={() => this.handleSessionToggle(2, i, m)}>
          Session {i+1}
        </DropdownItem>);
    }

    return(
      <CardBlock>
          <ButtonDropdown isOpen={this.state.w3DropdownOpen} toggle={this.handleW3Toggle}>
            <Button id="caret" size="sm" color="primary" onClick={() => this.toggle(2, m)}>
              {m.devices[2].deviceID}
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              {SessionDropdown}
            </DropdownMenu>
          </ButtonDropdown>
      </CardBlock>
    );
  }

  WatchFourButton(m) {
    let SessionDropdown = [];

    for (let i = 0; i < m.devices[3].SessionCount; i++) {
      SessionDropdown.push(
        <DropdownItem key={i} onClick={() => this.handleSessionToggle(3, i, m)}>
          Session {i+1}
        </DropdownItem>);
    }

    return(
      <CardBlock >
          <ButtonDropdown isOpen={this.state.w4DropdownOpen} toggle={this.handleW4Toggle}>
            <Button id="caret" size="sm" color="primary" onClick={() => this.toggle(3, m)}>
              {m.devices[3].deviceID}
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              {SessionDropdown}
            </DropdownMenu>
          </ButtonDropdown>
      </CardBlock>
    );
  }

  WatchFiveButton(m) {
    let SessionDropdown = [];

    for (let i = 0; i < m.devices[4].SessionCount; i++) {
      SessionDropdown.push(
        <DropdownItem key={i} onClick={() => this.handleSessionToggle(4, i, m)}>
          Session {i+1}
        </DropdownItem>);
    }

    return(
      <CardBlock >
          <ButtonDropdown isOpen={this.state.w5DropdownOpen} toggle={this.handleW5Toggle}>
            <Button id="caret" size="sm" color="primary" onClick={() => this.toggle(4, m)}>
              {m.devices[4].deviceID}
            </Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              {SessionDropdown}
            </DropdownMenu>
          </ButtonDropdown>
      </CardBlock>
    );
  }

  render() {
      const ViewContent = ({children}) => (
          <div className="view-content view-components">
              <Card>
                  <CardBlock>
                      {children}
                  </CardBlock>
              </Card>
          </div>
      );

      const options = {
        onRowClick: function(row) {
          console.log(`You clicked row id: ${row.id}`)
        }
      };

      return(
      <div>
        {this.state.data.map(function(m) {
          return (
            <div key={m} className="map">
              <CardDeck className="sales-card mb-3">
                <CardBlock>
                    <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.onDismiss}>
                      <strong>Error!</strong> You have reached the most previous/recent code blue statistics.
                    </Alert>
                  <div className="text-right">
                  <ButtonGroup>
                      <Button onClick={() => this.handlePrevNext(1)}>Prev</Button>
                      <Button onClick={() => this.handlePrevNext(2)}>Next</Button>
                      <ButtonDropdown isOpen={this.state.dropdownICUOpen} toggle={this.handleICUToggle}>
                          <DropdownToggle caret>
                              Choose ICU
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => this.onDropDownClick(1)}>Medical ICU</DropdownItem>
                            <DropdownItem onClick={() => this.onDropDownClick(2)}>Surgical ICU</DropdownItem>
                          </DropdownMenu>
                      </ButtonDropdown>
                  </ButtonGroup>
                  </div>
                </CardBlock>
              </CardDeck>
              <div className="mb-3">
                <Button color="danger" onClick={this.toggleModal}>Register Code Blue</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
                <ModalHeader toggle={this.toggleModal}>Code Blue Data Form</ModalHeader>
                  <ModalBody>
                    <Form>
                      <FormGroup row>
                        <Label for="adminName" sm={3}>Administrator</Label>
                        <Col sm={9}><Input type="admin" name="admin" id="adminName" placeholder="Administrator name" /></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="patientWeight" sm={3}>Weight</Label>
                        <Col sm={9}><Input type="weight" name="weight" id="pWeight" placeholder="Patient's weight in lb" /></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="patientHR" sm={3}>Heart Rate</Label>
                        <Col sm={9}><Input type="rate" name="hRate" id="hRate" placeholder="Patient's heart rate in bpm" /></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="patientBP" sm={3}>Blood Pressure</Label>
                        <Col sm={9}><Input type="pressure" name="bPressure" id="bPressure" placeholder="Patient's blood pressure" /></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="patientO2" sm={3}>Oxygen Saturation</Label>
                        <Col sm={9}><Input type="o2" name="o2Sat" id="o2Sat" placeholder="Patient's oxygen saturation" /></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="checkbox" sm={3}>Check all &nbsp; that apply</Label>
                        <Col sm={9}>
                          <FormGroup className="checkbox">
                            <Label className="checkbox">
                              <Input type="checkbox" id="obeseCheck"/>
                               <span className="checkbox-label">&nbsp;Patient was obese</span>
                            </Label>
                          </FormGroup>
                          <FormGroup className="checkbox">
                            <Label className="checkbox">
                              <Input type="checkbox" id="cprCheck"/>
                              <span className="checkbox-label">&nbsp;CPR was successful</span>
                            </Label>
                          </FormGroup>
                          <FormGroup className="checkbox">
                            <Label className="checkbox">
                              <Input type="checkbox" id="roscCheck"/>
                              <span className="checkbox-label">&nbsp;ROSC Achieved</span>
                            </Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.toggleModal}>Submit</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                  </ModalFooter>
                </Modal>
              </div>
              <CardGroup className="sales-card mb-3">
                <Card style={{'flex': '3 0 0'}}>
                  <CardBlock>
                    <CardTitle className="d-flex justify-content-between flex-wrap text-uppercase h6">
                      {this.state.currLocIds[this.state.currLocPos].location + " - " + this.state.currLocIds[this.state.currLocPos].ts}
                      <div className="text-right">
                        <ButtonGroup>
                          <Button color="primary" onClick={() => this.onDRBtnClick(1)} active={this.state.rSelected === 1}>Rate</Button>
                          <Button color="primary" onClick={() => this.onDRBtnClick(2)} active={this.state.rSelected === 2}>Depth</Button>
                        </ButtonGroup>
                      </div>
                    </CardTitle>
                      <div style={{width: '100%', height: '300px'}}>
                          <ResponsiveContainer>
                            <LineChart data={this.state.update} height={3} margin={{top: 10, right: 10, left: -15, bottom: 0}}>
                              <XAxis dataKey="name" axisLine={false} fontSize={10} tickLine={false} padding={{left: 30, right: 30}}/>
                              <YAxis fontSize={10} axisLine={false} tickLine={false}/>
                              <CartesianGrid stroke="#eee" vertical={false}/>
                              <Tooltip wrapperStyle={{borderColor: '#eee'}}/>
                              <Legend />
                              <Line type='monotone' dataKey={this.state.dataKey} dstroke="#448AFF" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                    </CardBlock>
                </Card>
                <Card>
                  <CardBlock>
                    <h6 className="text-uppercase title font-weight-bold small">Total pauses</h6>
                    <h4 className="font-weight-normal mb-0">{this.state.totalPauses}</h4>
                  </CardBlock>
                  <CardBlock>
                    <h6 className="text-uppercase title font-weight-bold small text-nowrap">Total Pumps</h6>
                  <h4 className="font-weight-normal mb-0">{this.state.totalPumps}</h4>
                  </CardBlock>
                  <CardBlock>
                    <h6 className="text-uppercase title font-weight-bold small">Average {this.state.dataKey}</h6>
                    <h4 className="font-weight-normal mb-0">{this.state.avg}</h4>
                  </CardBlock>
                </Card>
              </CardGroup>
              <Card className="mb-3">
              <CardBlock>
                <CardTitle className="text-uppercase h6">
                  Device Battery Percentages
                </CardTitle>
                <div className="d-flex justify-content-between flex-wrap ml-5 mr-5 text-uppercase mb-0">
                  <h6>Watch 1</h6>
                  <h6>Watch 2</h6>
                  <h6>Watch 3</h6>
                  <h6>Watch 4</h6>
                  <h6>Watch 5</h6>
                </div>
                <div className="d-flex justify-content-between flex-wrap ml-5 mr-5 mb-0">
                  <CircularProgressbar percentage={m.devices[0].devicePower} />
                  <CircularProgressbar percentage={m.devices[1].devicePower} />
                  <CircularProgressbar percentage={m.devices[2].devicePower} />
                  <CircularProgressbar percentage={m.devices[3].devicePower} />
                  <CircularProgressbar percentage={m.devices[4].devicePower} />
                </div>
              </CardBlock>
              </Card>
              <CardGroup className="sales-card mb-3">
                <Card style={{'flex': '3 0 0'}}>
                  <CardBlock>
                    <CardTitle className="d-flex justify-content-between flex-wrap text-uppercase h6">
                      {m.devices[this.state.currDevicePos].deviceID+" Session "+(this.state.currSessionPos+1)+" Statistics"}
                      <div className="text-right">
                        <ButtonGroup>
                          <Button color="primary" onClick={() => this.onPRBtnClick(1,m)} active={this.state.bSelected === 1}>Pumps</Button>
                          <Button color="primary" onClick={() => this.onPRBtnClick(2,m)} active={this.state.bSelected === 2}>Recoil</Button>
                        </ButtonGroup>
                      </div>
                    </CardTitle>
                    <div style={{width: '100%', height: '300px'}}>
                    <ResponsiveContainer>
                      <BarChart data={this.state.pumpChart}
                              height={3} margin={{top: 10, right: 10, left: -15, bottom: 0}}>
                        <YAxis fontSize={10} axisLine={false} tickLine={false}/>
                        <XAxis axisLine={false} fontSize={10} tickLine={false} padding={{left: 20, right: 20}}/>
                        <CartesianGrid stroke="#eee" vertical={false}/>
                        <Tooltip wrapperStyle={{borderColor: '#eee'}}/>
                        <Bar dataKey={this.state.watchDataKey} fill="#82ca9d"/>
                        <Bar dataKey='depth2' fill="#dc143c" />
                      </BarChart>
                    </ResponsiveContainer>
                    </div>
                  </CardBlock>
                </Card>
              </CardGroup>
              <div className="d-flex justify-content-between flex-wrap mb-3">
                {this.WatchOneButton(m)}
                {this.WatchTwoButton(m)}
                {this.WatchThreeButton(m)}
                {this.WatchFourButton(m)}
                {this.WatchFiveButton(m)}
              </div>
              <CardGroup className=" mb-4">
                <Card >
                  <CardBlock>
                    <CardTitle className="text-uppercase h6">
                      {m.devices[this.state.currDevicePos].deviceID + " Session "+(this.state.currSessionPos+1)+" Statistics"}
                    </CardTitle>
                      <Row className="mb-4">
                          <Col md="3" xs="12" className="mb-1">
                              <Card color="primary" outline>
                                  <CardBlock>
                                    <h6 className="text-uppercase title font-weight-bold small">
                                      Average Depth
                                    </h6>
                                    <h4 className="font-weight-normal mb-0">
                                      {m.devices[this.state.currDevicePos].SessionData[this.state.currSessionPos].AverageDepth}
                                    </h4>
                                  </CardBlock>
                              </Card>
                          </Col>
                          <Col md="3" xs="12" className="mb-1">
                              <Card color="primary" outline>
                                  <CardBlock>
                                    <h6 className="text-uppercase title font-weight-bold small">
                                      Average Rate
                                    </h6>
                                    <h4 className="font-weight-normal mb-0">
                                      {m.devices[this.state.currDevicePos].SessionData[this.state.currSessionPos].AverageRate}
                                    </h4>
                                  </CardBlock>
                              </Card>
                          </Col>
                          <Col md="3" xs="12" className="mb-1">
                            <Card color="primary" outline>
                              <CardBlock>
                                <h6 className="text-uppercase title font-weight-bold small">
                                  Total Pumps
                                </h6>
                                 <h4 className="font-weight-normal mb-0">
                                   {m.devices[this.state.currDevicePos].SessionData[this.state.currSessionPos].TotalPumps}
                                </h4>
                              </CardBlock>
                           </Card>
                          </Col>
                          <Col md="3" xs="12" className="mb-1">
                              <Card color="primary" outline>
                                  <CardBlock>
                                    <h6 className="text-uppercase title font-weight-bold small">
                                      Total Pauses
                                    </h6>
                                    <h4 className="font-weight-normal mb-0">
                                      {m.devices[this.state.currDevicePos].SessionData[this.state.currSessionPos].Pauses}
                                    </h4>
                                  </CardBlock>
                              </Card>
                          </Col>
                      </Row>
                    </CardBlock>
                </Card>
              </CardGroup>

              <Card className="mb-4">
                  <CardBlock className="table-responsive">
                      <h6 className="mb-4 text-uppercase">
                        {m.devices[this.state.currDevicePos].deviceID+" Raw Session Data"}
                      </h6>
                      <Table className="table" data={this.state.pumps} sortable={true} itemsPerPage={15} pageButtonLimit={5}>
                          <Thead>
                            <Th column="no"><span>No.</span></Th>
                            <Th column="depth"><span>depth</span></Th>
                            <Th column="start_ts"><span>start</span></Th>
                            <Th column="end_ts"><span>end</span></Th>
                            <Th column="pumpStart"><span>pumpStart</span></Th>
                            <Th column="pumpEnd"><span>pumpEnd</span></Th>
                            <Th column="ts_index"><span>ts_index</span></Th>
                            <Th column="recoil"><span>recoil</span></Th>
                          </Thead>
                      </Table>
                  </CardBlock>
              </Card>
              <Card>
                <CardBlock className="table-responsive">
                  <CardTitle className="text-uppercase h6">Recent {this.state.currLocIds[this.state.currLocPos].location} Code Blues</CardTitle>
                  <div className="small mb-4 card-subtitle"><Button color="primary" size="sm">View all locations</Button></div>
                      <BootstrapTable data={ this.state.currLocIds } options={ options }>
                        <TableHeaderColumn dataField='id' isKey>id</TableHeaderColumn>
                        <TableHeaderColumn dataField='location'>Location</TableHeaderColumn>
                        <TableHeaderColumn dataField='ts'>time</TableHeaderColumn>
                      </BootstrapTable>
                    </CardBlock>
                </Card>
            </div>
          )
        }, this)}
      </div>
      );
    }
}

export default () => (
    <div className="view-content view-dashboard">
      <CodeBlueDash/>
    </div>
)
