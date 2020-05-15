import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import _ from "lodash"

const App = () => {
      const [nodes, setNodes] = useState([
            {
                  source: "A",
                  to: "B",
                  distance: 6,
            },
            {
                  source: "A",
                  to: "D",
                  distance: 1,
            },
            {
                  source: "B",
                  to: "D",
                  distance: 2,
            },
            {
                  source: "D",
                  to: "E",
                  distance: 1,
            },
            {
                  source: "B",
                  to: "E",
                  distance: 2,
            },
            {
                  source: "B",
                  to: "C",
                  distance: 5,
            },
            {
                  source: "E",
                  to: "C",
                  distance: 5,
            },
            // {
            //       source: null,
            //       to: null,
            //       distance: null,
            // },
      ])
      const [source, setSource] = useState(null)
      const [to, setTo] = useState(null)
      const [graph, setGraph] = useState([])
      const [buttonMode, setButtonMode] = useState("compute")
      const handleInput = ({ target: { name, value } }, index) => {
            setNodes(
                  nodes.map((item, idx) => {
                        if (idx === index) {
                              return {
                                    ...item,
                                    [name]: value,
                              }
                        }
                        return item
                  })
            )
      }
      const handleSubmit = () => {
            let nodeTmp = []
            setButtonMode("back")
            nodes.forEach((node) => {
                  nodeTmp.push({
                        source: node.source,
                        to: node.to,
                        distance: node.distance,
                  })
                  nodeTmp.push({
                        source: node.to,
                        to: node.source,
                        distance: node.distance,
                  })
            })
            let statusObj = {}
            makeOption().forEach((key) => {
                  statusObj[key] = {
                        point: key,
                        distance: Infinity,
                        status: "in process",
                        from: key,
                  }
            })
            statusObj[source] = {
                  ...statusObj[source],
                  distance: 0,
            }
            while (
                  _.values(statusObj).filter(
                        (item) => item.status === "in process"
                  ).length > 0
            ) {
                  let statusObjTmp = _.values(statusObj)
                        .filter((item) => item.status === "in process")
                        .sort((a, b) => a.distance - b.distance)

                  let topPoint = statusObjTmp[0].point
                  nodeTmp.forEach((node) => {
                        if (node.source === topPoint) {
                              if (
                                    statusObj[topPoint].distance +
                                          +node.distance <
                                    statusObj[node.to].distance
                              ) {
                                    statusObj[node.to].distance =
                                          statusObj[topPoint].distance +
                                          +node.distance
                                    statusObj[node.to].from = topPoint
                              }
                        }
                  })
                  statusObj[topPoint].status = "done"
            }
            setGraph(statusObj)
      }
      const makeOption = () => {
            let uniq = {}
            nodes.forEach((node) => {
                  uniq[node.source] = 0
                  uniq[node.to] = 0
            })
            return Object.keys(uniq)
      }
      const showResult = () => {
            let isFinish = false
            let cur = to
            let path = ""
            if (cur && graph[cur]) {
                  path += cur
                  while (!isFinish) {
                        path += " -> " + graph[cur].from
                        cur = graph[cur].from
                        if (cur === source) {
                              isFinish = true
                        }
                  }
            }
            if (path) {
                  return (
                        <div className="text-center">
                              <h4>{path}</h4>
                              <h4>distance: {graph[to].distance}</h4>
                        </div>
                  )
            }
            return path
      }
      return (
            <div Name="container-fluid">
                  <div className="d-flex justify-content-center mt-3 mx-3">
                        <form
                              style={{ minWidth: "40vw" }}
                              onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmit()
                              }}
                        >
                              <h4 className="text-center mb-3">
                                    Find shortest path (Dijkstra)
                              </h4>
                              {nodes.map((node, index) => (
                                    <div className="form-group row mt-3">
                                          <div className="col-sm">
                                                <input
                                                      name="source"
                                                      value={node.source}
                                                      placeholder="source"
                                                      onChange={(e) =>
                                                            handleInput(
                                                                  e,
                                                                  index
                                                            )
                                                      }
                                                      className="form-control"
                                                      required
                                                />
                                          </div>
                                          <div className="col-sm">
                                                <input
                                                      name="to"
                                                      value={node.to}
                                                      placeholder="to"
                                                      onChange={(e) =>
                                                            handleInput(
                                                                  e,
                                                                  index
                                                            )
                                                      }
                                                      className="form-control"
                                                      required
                                                />
                                          </div>
                                          <div className="col-sm">
                                                <input
                                                      name="distance"
                                                      value={node.distance}
                                                      placeholder="distance"
                                                      onChange={(e) =>
                                                            handleInput(
                                                                  e,
                                                                  index
                                                            )
                                                      }
                                                      className="form-control"
                                                      type="number"
                                                      required
                                                />
                                          </div>
                                          <div className="col-sm">
                                                <button
                                                      type="button"
                                                      class="btn btn-danger btn-block"
                                                      onClick={() => {
                                                            setNodes(
                                                                  nodes.filter(
                                                                        (
                                                                              item,
                                                                              idx
                                                                        ) =>
                                                                              index !==
                                                                              idx
                                                                  )
                                                            )
                                                      }}
                                                >
                                                      delete
                                                </button>
                                          </div>
                                    </div>
                              ))}
                              <div className="d-flex justify-content-around">
                                    <div>
                                          <button
                                                type="button"
                                                class="btn btn-primary btn-block"
                                                onClick={() => {
                                                      setNodes([
                                                            ...nodes,
                                                            {
                                                                  source: null,
                                                                  to: null,
                                                                  distance: null,
                                                            },
                                                      ])
                                                }}
                                          >
                                                ADD Node
                                          </button>
                                    </div>
                              </div>
                              {buttonMode === "compute" ? (
                                    <div
                                          className="form-row align-items-center mt-3"
                                          style={{
                                                visibility:
                                                      nodes.length > 0
                                                            ? "visible"
                                                            : "hidden",
                                          }}
                                    >
                                          <div className="col-sm">
                                                <select
                                                      className="form-control"
                                                      value={source}
                                                      onChange={({
                                                            target: { value },
                                                      }) => setSource(value)}
                                                      required
                                                >
                                                      <option
                                                            disabled
                                                            selected
                                                            value=""
                                                      >
                                                            select source
                                                      </option>
                                                      {makeOption().map(
                                                            (node) => (
                                                                  <>
                                                                        <option>
                                                                              {
                                                                                    node
                                                                              }
                                                                        </option>
                                                                  </>
                                                            )
                                                      )}
                                                </select>
                                          </div>
                                          <div className="col-sm">
                                                <select
                                                      className="form-control"
                                                      value={to}
                                                      onChange={({
                                                            target: { value },
                                                      }) => setTo(value)}
                                                      required
                                                >
                                                      <option
                                                            disabled
                                                            selected
                                                            value=""
                                                      >
                                                            select destination
                                                      </option>
                                                      {makeOption().map(
                                                            (node) => (
                                                                  <>
                                                                        <option>
                                                                              {
                                                                                    node
                                                                              }
                                                                        </option>
                                                                  </>
                                                            )
                                                      )}
                                                </select>
                                          </div>
                                          <div className="col-sm">
                                                <button
                                                      type="submit"
                                                      class="btn btn-success btn-block"
                                                >
                                                      COMPUTE
                                                </button>
                                          </div>
                                    </div>
                              ) : null}
                              {buttonMode === "back" ? (
                                    <div className="form-row align-items-center mt-3">
                                          <div className="col-sm">
                                                <button
                                                      type="button"
                                                      class="btn btn-success btn-block"
                                                      onClick={() =>
                                                            setButtonMode(
                                                                  "compute"
                                                            )
                                                      }
                                                >
                                                      BACK
                                                </button>
                                          </div>
                                    </div>
                              ) : null}
                        </form>
                  </div>
                  <div>{buttonMode === "back" ? showResult(to) : null}</div>
            </div>
      )
}

export default App
