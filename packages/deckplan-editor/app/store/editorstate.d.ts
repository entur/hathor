import type { BuildableElement, DeckPlan } from '@/models/netex/deckplan/deckPlan';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance';
import type { PassengerEquipment } from '@/models/netex/passengerEquipment';
export declare const useEditorState: import('pinia').StoreDefinition<
  'editor',
  {
    deckplan: DeckPlan | undefined;
    equipments: PassengerEquipment[];
    wrapper: object | undefined;
    selectedDeckLevelId: string | undefined;
    selectedElementId: string | undefined;
    scale: number;
    activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
    activeEquipment: string | undefined;
    elementToBuild: any | undefined;
  },
  {
    selectedDeck: (
      state: {
        deckplan:
          | {
              attr_id: string;
              attr_version: string;
              deckLevels: {
                attr_id: string;
                attr_version: string;
                Label: string;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Label: string;
                };
              }[];
              decks: {
                attr_id: string;
                attr_version: string;
                Name: string;
                polygon:
                  | {
                      value: object;
                      toXML: () => object;
                    }
                  | undefined;
                deckspaces: (
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      actualVehicleEquipments: {
                        Units: number;
                        TicketingEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        TicketValidatorEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        toXML: () => any;
                        Fixed?: boolean | undefined;
                        attr_id: string;
                        attr_version: string;
                        Name?: string | undefined;
                        Description?: string | undefined;
                      }[];
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name:
                          | (() => {
                              text_value: string;
                            })
                          | undefined;
                      };
                    }
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      SmokingAllowed: boolean | undefined;
                      StandingAllowed: boolean | undefined;
                      PassengerSpaceType:
                        | 'seatingArea'
                        | 'passengerCabin'
                        | 'vehicleArea'
                        | 'luggageStore'
                        | 'corridor'
                        | 'restaurant'
                        | 'toilet'
                        | 'bathroom'
                        | 'other'
                        | undefined;
                      passengerSpots:
                        | (
                            | {
                                IsByWindow: boolean | undefined;
                                IsByAisle: boolean | undefined;
                                IsBetweenSeats: boolean | undefined;
                                IsInFrontRow: boolean | undefined;
                                IsInEndRow: boolean | undefined;
                                TableType: string | undefined;
                                HasPower: boolean | undefined;
                                Centroid:
                                  | {
                                      x: number;
                                      y: number;
                                      toXML: () => {
                                        Location: {
                                          pos: string;
                                        };
                                      };
                                    }
                                  | undefined;
                                Width: number;
                                Length: number;
                                availability: undefined | import('../..').PassengerSpotAvailability;
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  Orientation:
                                    | {
                                        text_value:
                                          | 'backwards'
                                          | 'forwards'
                                          | 'leftwards'
                                          | 'rightwards';
                                      }
                                    | undefined;
                                  actualVehicleEquipments: any;
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  IsByWindow:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  IsByAisle:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  TableType:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  HasPower:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  Centroid:
                                    | {
                                        Location: {
                                          pos: string;
                                        };
                                      }
                                    | undefined;
                                  Width: number;
                                  Length: number;
                                };
                                getClasses: () => string;
                                getShape: (scale: number) =>
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      stroke: string;
                                      strokeWidth: number;
                                      cornerRadius: number;
                                      draggable: boolean;
                                    }
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      draggable: boolean;
                                      stroke?: undefined;
                                      strokeWidth?: undefined;
                                      cornerRadius?: undefined;
                                    };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      luggageSpots:
                        | (
                            | {
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label: string | undefined;
                                  Orientation:
                                    | 'backwards'
                                    | 'forwards'
                                    | 'leftwards'
                                    | 'rightwards'
                                    | undefined;
                                  actualVehicleEquipments: {
                                    ActualVehicleEquipment: object[];
                                  };
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      deckEntrances:
                        | {
                            attr_id: string;
                            attr_version: string;
                            Name:
                              | {
                                  value: string;
                                  toXML: () => {
                                    text_value: string;
                                  };
                                }
                              | undefined;
                            Label: string | undefined;
                            Width: number | undefined;
                            Height: number | undefined;
                            actualVehicleEquipments: {
                              Units: number;
                              TicketingEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              TicketValidatorEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              toXML: () => any;
                              Fixed?: boolean | undefined;
                              attr_id: string;
                              attr_version: string;
                              Name?: string | undefined;
                              Description?: string | undefined;
                            }[];
                            PublicUse: boolean | undefined;
                            VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                            SequenceFromFront: number | undefined;
                            HeightFromGround: number | undefined;
                            DeckEntranceType: 'external' | 'internal' | undefined;
                            IsEmergencyExit: boolean | undefined;
                            HasDoor: boolean | undefined;
                            IsAutomatic: boolean | undefined;
                            Centroid:
                              | {
                                  x: number;
                                  y: number;
                                  toXML: () => {
                                    Location: {
                                      pos: string;
                                    };
                                  };
                                }
                              | undefined;
                            toXML: () => {
                              attr_id: string;
                              attr_version: string;
                              Name:
                                | {
                                    text_value: string;
                                  }
                                | undefined;
                              Label: string | undefined;
                              Width: number | undefined;
                              Height: number | undefined;
                              actualVehicleEquipments: {
                                ActualVehicleEquipment: object[];
                              };
                              PublicUse: boolean | undefined;
                              VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                              SequenceFromFront: number | undefined;
                              HeightFromGround: number | undefined;
                              DeckEntranceType: 'external' | 'internal' | undefined;
                              IsEmergencyExit: boolean | undefined;
                              HasDoor: boolean | undefined;
                              IsAutomatic: boolean | undefined;
                              Centroid:
                                | {
                                    Location: {
                                      pos: string;
                                    };
                                  }
                                | undefined;
                            };
                            getShape: (
                              scale: number,
                              deckLength: number,
                              deckWidth: number
                            ) => {
                              x: number;
                              y: number;
                              width: number;
                              height: number;
                              fill: string;
                              stroke: string;
                              strokeWidth: number;
                              draggable: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceUsage:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            validityConditions: (
                              | {
                                  attr_id: string;
                                  attr_version: string;
                                  Name: string;
                                  toXML: () => {
                                    attr_id: string;
                                    Name: string;
                                    attr_version: string;
                                  };
                                }
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                            )[];
                            Name: string;
                            EntranceUsageType: 'exit' | 'entrance' | undefined;
                            EntranceSetting: 'shut' | 'open' | undefined;
                            ControlledLocking: boolean;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              validityConditions: any;
                              Name: string;
                              EntranceUsageType: 'exit' | 'entrance' | undefined;
                              EntranceSetting: 'shut' | 'open' | undefined;
                              ControlledLocking: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceCouples:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            FromDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            ToDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              FromDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                              ToDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                          }[]
                        | undefined;
                      deckSpaceCapacities:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            LocatableSpotType: 'seat' | undefined;
                            capacity: number;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              LocatableSpotType: 'seat' | undefined;
                              capacity: number;
                            };
                          }[]
                        | undefined;
                      actualVehicleEquipments:
                        | {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[]
                        | undefined;
                      ServiceFacilitySetRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      Centroid:
                        | {
                            x: number;
                            y: number;
                            toXML: () => {
                              Location: {
                                pos: string;
                              };
                            };
                          }
                        | undefined;
                      Polygon:
                        | {
                            value: object;
                            toXML: () => object;
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      FareClass: string | undefined;
                      AirConditioned: boolean | undefined;
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name: import('../..').Name | undefined;
                        SmokingAllowed: boolean | undefined;
                        StandingAllowed: boolean | undefined;
                        PassengerSpaceType:
                          | 'seatingArea'
                          | 'passengerCabin'
                          | 'vehicleArea'
                          | 'luggageStore'
                          | 'corridor'
                          | 'restaurant'
                          | 'toilet'
                          | 'bathroom'
                          | 'other'
                          | undefined;
                        passengerSpots: any;
                        luggageSpots: any;
                        deckEntrances: any;
                        deckEntranceUsage: any;
                        deckEntranceCouples: any;
                        deckSpaceCapacities: any;
                        actualVehicleEquipments: any;
                        ServiceFacilitySetRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                            }
                          | undefined;
                        Centroid:
                          | {
                              Location: {
                                pos: string;
                              };
                            }
                          | undefined;
                        Polygon: object | undefined;
                        PublicUse: boolean | undefined;
                        TotalCapacity: number | undefined;
                        FareClass: string | undefined;
                        AirConditioned: boolean | undefined;
                      };
                    }
                )[];
                DeckLevelRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                spotRows: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                spotColumns: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                Width: number;
                Length: number;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  spotRows: {
                    SpotRow: object[];
                  };
                  spotColumns: {
                    SpotColumn: object[];
                  };
                  deckSpaces: any;
                  DeckLevelRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                      }
                    | undefined;
                  polygon: object | undefined;
                  Name: string;
                  Width: number;
                  Length: number;
                };
                getBoundingBox: () => {
                  width: number;
                  height: number;
                };
                getShape: (scale: number) => {
                  x: number;
                  y: number;
                  width: number;
                  height: number;
                  fill: string;
                  stroke: string;
                  strokeWidth: number;
                  cornerRadius: number;
                };
              }[];
              addDeckLevel: () => void;
              removeDeckLevel: (deckLevelId: string) => void;
              toXML: () => {
                DeckPlan: {
                  xmlTagName: string;
                  attr_id: string;
                  attr_version: string;
                  decks: {
                    Deck: object[];
                  };
                  deckLevels: {
                    DeckLevel: object[];
                  };
                };
              };
            }
          | undefined;
        equipments: {
          Fixed?: boolean | undefined;
          toXML: () => any;
          attr_id: string;
          attr_version: string;
          Name?: string | undefined;
          Description?: string | undefined;
        }[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      } & import('pinia').PiniaCustomStateProperties<{
        deckplan: DeckPlan | undefined;
        equipments: PassengerEquipment[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      }>
    ) =>
      | {
          attr_id: string;
          attr_version: string;
          Name: string;
          polygon:
            | {
                value: object;
                toXML: () => object;
              }
            | undefined;
          deckspaces: (
            | {
                attr_id: string;
                attr_version: string;
                Name:
                  | {
                      value: string;
                      toXML: () => {
                        text_value: string;
                      };
                    }
                  | undefined;
                PublicUse: boolean | undefined;
                TotalCapacity: number | undefined;
                actualVehicleEquipments: {
                  Units: number;
                  TicketingEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  TicketValidatorEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  toXML: () => any;
                  Fixed?: boolean | undefined;
                  attr_id: string;
                  attr_version: string;
                  Name?: string | undefined;
                  Description?: string | undefined;
                }[];
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Name:
                    | (() => {
                        text_value: string;
                      })
                    | undefined;
                };
              }
            | {
                attr_id: string;
                attr_version: string;
                Name:
                  | {
                      value: string;
                      toXML: () => {
                        text_value: string;
                      };
                    }
                  | undefined;
                SmokingAllowed: boolean | undefined;
                StandingAllowed: boolean | undefined;
                PassengerSpaceType:
                  | 'seatingArea'
                  | 'passengerCabin'
                  | 'vehicleArea'
                  | 'luggageStore'
                  | 'corridor'
                  | 'restaurant'
                  | 'toilet'
                  | 'bathroom'
                  | 'other'
                  | undefined;
                passengerSpots:
                  | (
                      | {
                          IsByWindow: boolean | undefined;
                          IsByAisle: boolean | undefined;
                          IsBetweenSeats: boolean | undefined;
                          IsInFrontRow: boolean | undefined;
                          IsInEndRow: boolean | undefined;
                          TableType: string | undefined;
                          HasPower: boolean | undefined;
                          Centroid:
                            | {
                                x: number;
                                y: number;
                                toXML: () => {
                                  Location: {
                                    pos: string;
                                  };
                                };
                              }
                            | undefined;
                          Width: number;
                          Length: number;
                          availability: undefined | import('../..').PassengerSpotAvailability;
                          toXML: () => {
                            attr_id: string;
                            attr_version: string;
                            Label:
                              | {
                                  text_value: string;
                                }
                              | undefined;
                            Orientation:
                              | {
                                  text_value: 'backwards' | 'forwards' | 'leftwards' | 'rightwards';
                                }
                              | undefined;
                            actualVehicleEquipments: any;
                            SpotColumnRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            SpotRowRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            IsByWindow:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            IsByAisle:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            TableType:
                              | {
                                  text_value: string;
                                }
                              | undefined;
                            HasPower:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            Centroid:
                              | {
                                  Location: {
                                    pos: string;
                                  };
                                }
                              | undefined;
                            Width: number;
                            Length: number;
                          };
                          getClasses: () => string;
                          getShape: (scale: number) =>
                            | {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                                fill: string;
                                stroke: string;
                                strokeWidth: number;
                                cornerRadius: number;
                                draggable: boolean;
                              }
                            | {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                                fill: string;
                                draggable: boolean;
                                stroke?: undefined;
                                strokeWidth?: undefined;
                                cornerRadius?: undefined;
                              };
                          attr_id: string;
                          attr_version: string;
                          Label: string | undefined;
                          Orientation:
                            | 'backwards'
                            | 'forwards'
                            | 'leftwards'
                            | 'rightwards'
                            | undefined;
                          actualVehicleEquipments: {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[];
                          SpotColumnRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                          SpotRowRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                        }
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                    )[]
                  | undefined;
                luggageSpots:
                  | (
                      | {
                          toXML: () => {
                            attr_id: string;
                            attr_version: string;
                            Label: string | undefined;
                            Orientation:
                              | 'backwards'
                              | 'forwards'
                              | 'leftwards'
                              | 'rightwards'
                              | undefined;
                            actualVehicleEquipments: {
                              ActualVehicleEquipment: object[];
                            };
                            SpotColumnRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            SpotRowRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                          };
                          attr_id: string;
                          attr_version: string;
                          Label: string | undefined;
                          Orientation:
                            | 'backwards'
                            | 'forwards'
                            | 'leftwards'
                            | 'rightwards'
                            | undefined;
                          actualVehicleEquipments: {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[];
                          SpotColumnRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                          SpotRowRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                        }
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                    )[]
                  | undefined;
                deckEntrances:
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      Label: string | undefined;
                      Width: number | undefined;
                      Height: number | undefined;
                      actualVehicleEquipments: {
                        Units: number;
                        TicketingEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        TicketValidatorEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        toXML: () => any;
                        Fixed?: boolean | undefined;
                        attr_id: string;
                        attr_version: string;
                        Name?: string | undefined;
                        Description?: string | undefined;
                      }[];
                      PublicUse: boolean | undefined;
                      VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                      SequenceFromFront: number | undefined;
                      HeightFromGround: number | undefined;
                      DeckEntranceType: 'external' | 'internal' | undefined;
                      IsEmergencyExit: boolean | undefined;
                      HasDoor: boolean | undefined;
                      IsAutomatic: boolean | undefined;
                      Centroid:
                        | {
                            x: number;
                            y: number;
                            toXML: () => {
                              Location: {
                                pos: string;
                              };
                            };
                          }
                        | undefined;
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name:
                          | {
                              text_value: string;
                            }
                          | undefined;
                        Label: string | undefined;
                        Width: number | undefined;
                        Height: number | undefined;
                        actualVehicleEquipments: {
                          ActualVehicleEquipment: object[];
                        };
                        PublicUse: boolean | undefined;
                        VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                        SequenceFromFront: number | undefined;
                        HeightFromGround: number | undefined;
                        DeckEntranceType: 'external' | 'internal' | undefined;
                        IsEmergencyExit: boolean | undefined;
                        HasDoor: boolean | undefined;
                        IsAutomatic: boolean | undefined;
                        Centroid:
                          | {
                              Location: {
                                pos: string;
                              };
                            }
                          | undefined;
                      };
                      getShape: (
                        scale: number,
                        deckLength: number,
                        deckWidth: number
                      ) => {
                        x: number;
                        y: number;
                        width: number;
                        height: number;
                        fill: string;
                        stroke: string;
                        strokeWidth: number;
                        draggable: boolean;
                      };
                    }[]
                  | undefined;
                deckEntranceUsage:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      validityConditions: (
                        | {
                            attr_id: string;
                            attr_version: string;
                            Name: string;
                            toXML: () => {
                              attr_id: string;
                              Name: string;
                              attr_version: string;
                            };
                          }
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                      )[];
                      Name: string;
                      EntranceUsageType: 'exit' | 'entrance' | undefined;
                      EntranceSetting: 'shut' | 'open' | undefined;
                      ControlledLocking: boolean;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        validityConditions: any;
                        Name: string;
                        EntranceUsageType: 'exit' | 'entrance' | undefined;
                        EntranceSetting: 'shut' | 'open' | undefined;
                        ControlledLocking: boolean;
                      };
                    }[]
                  | undefined;
                deckEntranceCouples:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      FromDeckEntranceRef: {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                      ToDeckEntranceRef: {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        FromDeckEntranceRef: {
                          attr_ref: string;
                          attr_version: string;
                        };
                        ToDeckEntranceRef: {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                    }[]
                  | undefined;
                deckSpaceCapacities:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      LocatableSpotType: 'seat' | undefined;
                      capacity: number;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        LocatableSpotType: 'seat' | undefined;
                        capacity: number;
                      };
                    }[]
                  | undefined;
                actualVehicleEquipments:
                  | {
                      Units: number;
                      TicketingEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      TicketValidatorEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      toXML: () => any;
                      Fixed?: boolean | undefined;
                      attr_id: string;
                      attr_version: string;
                      Name?: string | undefined;
                      Description?: string | undefined;
                    }[]
                  | undefined;
                ServiceFacilitySetRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                Centroid:
                  | {
                      x: number;
                      y: number;
                      toXML: () => {
                        Location: {
                          pos: string;
                        };
                      };
                    }
                  | undefined;
                Polygon:
                  | {
                      value: object;
                      toXML: () => object;
                    }
                  | undefined;
                PublicUse: boolean | undefined;
                TotalCapacity: number | undefined;
                FareClass: string | undefined;
                AirConditioned: boolean | undefined;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Name: import('../..').Name | undefined;
                  SmokingAllowed: boolean | undefined;
                  StandingAllowed: boolean | undefined;
                  PassengerSpaceType:
                    | 'seatingArea'
                    | 'passengerCabin'
                    | 'vehicleArea'
                    | 'luggageStore'
                    | 'corridor'
                    | 'restaurant'
                    | 'toilet'
                    | 'bathroom'
                    | 'other'
                    | undefined;
                  passengerSpots: any;
                  luggageSpots: any;
                  deckEntrances: any;
                  deckEntranceUsage: any;
                  deckEntranceCouples: any;
                  deckSpaceCapacities: any;
                  actualVehicleEquipments: any;
                  ServiceFacilitySetRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                      }
                    | undefined;
                  Centroid:
                    | {
                        Location: {
                          pos: string;
                        };
                      }
                    | undefined;
                  Polygon: object | undefined;
                  PublicUse: boolean | undefined;
                  TotalCapacity: number | undefined;
                  FareClass: string | undefined;
                  AirConditioned: boolean | undefined;
                };
              }
          )[];
          DeckLevelRef:
            | {
                attr_ref: string;
                attr_version: string;
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                };
              }
            | undefined;
          spotRows: {
            attr_id: string;
            label: string;
            toXML: () => {
              attr_id: string;
              label: string;
            };
          }[];
          spotColumns: {
            attr_id: string;
            label: string;
            toXML: () => {
              attr_id: string;
              label: string;
            };
          }[];
          Width: number;
          Length: number;
          toXML: () => {
            attr_id: string;
            attr_version: string;
            spotRows: {
              SpotRow: object[];
            };
            spotColumns: {
              SpotColumn: object[];
            };
            deckSpaces: any;
            DeckLevelRef:
              | {
                  attr_ref: string;
                  attr_version: string;
                }
              | undefined;
            polygon: object | undefined;
            Name: string;
            Width: number;
            Length: number;
          };
          getBoundingBox: () => {
            width: number;
            height: number;
          };
          getShape: (scale: number) => {
            x: number;
            y: number;
            width: number;
            height: number;
            fill: string;
            stroke: string;
            strokeWidth: number;
            cornerRadius: number;
          };
        }
      | undefined;
    selectedDeckId: (
      state: {
        deckplan:
          | {
              attr_id: string;
              attr_version: string;
              deckLevels: {
                attr_id: string;
                attr_version: string;
                Label: string;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Label: string;
                };
              }[];
              decks: {
                attr_id: string;
                attr_version: string;
                Name: string;
                polygon:
                  | {
                      value: object;
                      toXML: () => object;
                    }
                  | undefined;
                deckspaces: (
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      actualVehicleEquipments: {
                        Units: number;
                        TicketingEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        TicketValidatorEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        toXML: () => any;
                        Fixed?: boolean | undefined;
                        attr_id: string;
                        attr_version: string;
                        Name?: string | undefined;
                        Description?: string | undefined;
                      }[];
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name:
                          | (() => {
                              text_value: string;
                            })
                          | undefined;
                      };
                    }
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      SmokingAllowed: boolean | undefined;
                      StandingAllowed: boolean | undefined;
                      PassengerSpaceType:
                        | 'seatingArea'
                        | 'passengerCabin'
                        | 'vehicleArea'
                        | 'luggageStore'
                        | 'corridor'
                        | 'restaurant'
                        | 'toilet'
                        | 'bathroom'
                        | 'other'
                        | undefined;
                      passengerSpots:
                        | (
                            | {
                                IsByWindow: boolean | undefined;
                                IsByAisle: boolean | undefined;
                                IsBetweenSeats: boolean | undefined;
                                IsInFrontRow: boolean | undefined;
                                IsInEndRow: boolean | undefined;
                                TableType: string | undefined;
                                HasPower: boolean | undefined;
                                Centroid:
                                  | {
                                      x: number;
                                      y: number;
                                      toXML: () => {
                                        Location: {
                                          pos: string;
                                        };
                                      };
                                    }
                                  | undefined;
                                Width: number;
                                Length: number;
                                availability: undefined | import('../..').PassengerSpotAvailability;
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  Orientation:
                                    | {
                                        text_value:
                                          | 'backwards'
                                          | 'forwards'
                                          | 'leftwards'
                                          | 'rightwards';
                                      }
                                    | undefined;
                                  actualVehicleEquipments: any;
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  IsByWindow:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  IsByAisle:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  TableType:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  HasPower:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  Centroid:
                                    | {
                                        Location: {
                                          pos: string;
                                        };
                                      }
                                    | undefined;
                                  Width: number;
                                  Length: number;
                                };
                                getClasses: () => string;
                                getShape: (scale: number) =>
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      stroke: string;
                                      strokeWidth: number;
                                      cornerRadius: number;
                                      draggable: boolean;
                                    }
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      draggable: boolean;
                                      stroke?: undefined;
                                      strokeWidth?: undefined;
                                      cornerRadius?: undefined;
                                    };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      luggageSpots:
                        | (
                            | {
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label: string | undefined;
                                  Orientation:
                                    | 'backwards'
                                    | 'forwards'
                                    | 'leftwards'
                                    | 'rightwards'
                                    | undefined;
                                  actualVehicleEquipments: {
                                    ActualVehicleEquipment: object[];
                                  };
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      deckEntrances:
                        | {
                            attr_id: string;
                            attr_version: string;
                            Name:
                              | {
                                  value: string;
                                  toXML: () => {
                                    text_value: string;
                                  };
                                }
                              | undefined;
                            Label: string | undefined;
                            Width: number | undefined;
                            Height: number | undefined;
                            actualVehicleEquipments: {
                              Units: number;
                              TicketingEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              TicketValidatorEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              toXML: () => any;
                              Fixed?: boolean | undefined;
                              attr_id: string;
                              attr_version: string;
                              Name?: string | undefined;
                              Description?: string | undefined;
                            }[];
                            PublicUse: boolean | undefined;
                            VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                            SequenceFromFront: number | undefined;
                            HeightFromGround: number | undefined;
                            DeckEntranceType: 'external' | 'internal' | undefined;
                            IsEmergencyExit: boolean | undefined;
                            HasDoor: boolean | undefined;
                            IsAutomatic: boolean | undefined;
                            Centroid:
                              | {
                                  x: number;
                                  y: number;
                                  toXML: () => {
                                    Location: {
                                      pos: string;
                                    };
                                  };
                                }
                              | undefined;
                            toXML: () => {
                              attr_id: string;
                              attr_version: string;
                              Name:
                                | {
                                    text_value: string;
                                  }
                                | undefined;
                              Label: string | undefined;
                              Width: number | undefined;
                              Height: number | undefined;
                              actualVehicleEquipments: {
                                ActualVehicleEquipment: object[];
                              };
                              PublicUse: boolean | undefined;
                              VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                              SequenceFromFront: number | undefined;
                              HeightFromGround: number | undefined;
                              DeckEntranceType: 'external' | 'internal' | undefined;
                              IsEmergencyExit: boolean | undefined;
                              HasDoor: boolean | undefined;
                              IsAutomatic: boolean | undefined;
                              Centroid:
                                | {
                                    Location: {
                                      pos: string;
                                    };
                                  }
                                | undefined;
                            };
                            getShape: (
                              scale: number,
                              deckLength: number,
                              deckWidth: number
                            ) => {
                              x: number;
                              y: number;
                              width: number;
                              height: number;
                              fill: string;
                              stroke: string;
                              strokeWidth: number;
                              draggable: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceUsage:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            validityConditions: (
                              | {
                                  attr_id: string;
                                  attr_version: string;
                                  Name: string;
                                  toXML: () => {
                                    attr_id: string;
                                    Name: string;
                                    attr_version: string;
                                  };
                                }
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                            )[];
                            Name: string;
                            EntranceUsageType: 'exit' | 'entrance' | undefined;
                            EntranceSetting: 'shut' | 'open' | undefined;
                            ControlledLocking: boolean;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              validityConditions: any;
                              Name: string;
                              EntranceUsageType: 'exit' | 'entrance' | undefined;
                              EntranceSetting: 'shut' | 'open' | undefined;
                              ControlledLocking: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceCouples:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            FromDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            ToDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              FromDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                              ToDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                          }[]
                        | undefined;
                      deckSpaceCapacities:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            LocatableSpotType: 'seat' | undefined;
                            capacity: number;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              LocatableSpotType: 'seat' | undefined;
                              capacity: number;
                            };
                          }[]
                        | undefined;
                      actualVehicleEquipments:
                        | {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[]
                        | undefined;
                      ServiceFacilitySetRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      Centroid:
                        | {
                            x: number;
                            y: number;
                            toXML: () => {
                              Location: {
                                pos: string;
                              };
                            };
                          }
                        | undefined;
                      Polygon:
                        | {
                            value: object;
                            toXML: () => object;
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      FareClass: string | undefined;
                      AirConditioned: boolean | undefined;
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name: import('../..').Name | undefined;
                        SmokingAllowed: boolean | undefined;
                        StandingAllowed: boolean | undefined;
                        PassengerSpaceType:
                          | 'seatingArea'
                          | 'passengerCabin'
                          | 'vehicleArea'
                          | 'luggageStore'
                          | 'corridor'
                          | 'restaurant'
                          | 'toilet'
                          | 'bathroom'
                          | 'other'
                          | undefined;
                        passengerSpots: any;
                        luggageSpots: any;
                        deckEntrances: any;
                        deckEntranceUsage: any;
                        deckEntranceCouples: any;
                        deckSpaceCapacities: any;
                        actualVehicleEquipments: any;
                        ServiceFacilitySetRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                            }
                          | undefined;
                        Centroid:
                          | {
                              Location: {
                                pos: string;
                              };
                            }
                          | undefined;
                        Polygon: object | undefined;
                        PublicUse: boolean | undefined;
                        TotalCapacity: number | undefined;
                        FareClass: string | undefined;
                        AirConditioned: boolean | undefined;
                      };
                    }
                )[];
                DeckLevelRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                spotRows: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                spotColumns: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                Width: number;
                Length: number;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  spotRows: {
                    SpotRow: object[];
                  };
                  spotColumns: {
                    SpotColumn: object[];
                  };
                  deckSpaces: any;
                  DeckLevelRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                      }
                    | undefined;
                  polygon: object | undefined;
                  Name: string;
                  Width: number;
                  Length: number;
                };
                getBoundingBox: () => {
                  width: number;
                  height: number;
                };
                getShape: (scale: number) => {
                  x: number;
                  y: number;
                  width: number;
                  height: number;
                  fill: string;
                  stroke: string;
                  strokeWidth: number;
                  cornerRadius: number;
                };
              }[];
              addDeckLevel: () => void;
              removeDeckLevel: (deckLevelId: string) => void;
              toXML: () => {
                DeckPlan: {
                  xmlTagName: string;
                  attr_id: string;
                  attr_version: string;
                  decks: {
                    Deck: object[];
                  };
                  deckLevels: {
                    DeckLevel: object[];
                  };
                };
              };
            }
          | undefined;
        equipments: {
          Fixed?: boolean | undefined;
          toXML: () => any;
          attr_id: string;
          attr_version: string;
          Name?: string | undefined;
          Description?: string | undefined;
        }[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      } & import('pinia').PiniaCustomStateProperties<{
        deckplan: DeckPlan | undefined;
        equipments: PassengerEquipment[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      }>
    ) => string | undefined;
    selectedElement: (
      state: {
        deckplan:
          | {
              attr_id: string;
              attr_version: string;
              deckLevels: {
                attr_id: string;
                attr_version: string;
                Label: string;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Label: string;
                };
              }[];
              decks: {
                attr_id: string;
                attr_version: string;
                Name: string;
                polygon:
                  | {
                      value: object;
                      toXML: () => object;
                    }
                  | undefined;
                deckspaces: (
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      actualVehicleEquipments: {
                        Units: number;
                        TicketingEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        TicketValidatorEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        toXML: () => any;
                        Fixed?: boolean | undefined;
                        attr_id: string;
                        attr_version: string;
                        Name?: string | undefined;
                        Description?: string | undefined;
                      }[];
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name:
                          | (() => {
                              text_value: string;
                            })
                          | undefined;
                      };
                    }
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      SmokingAllowed: boolean | undefined;
                      StandingAllowed: boolean | undefined;
                      PassengerSpaceType:
                        | 'seatingArea'
                        | 'passengerCabin'
                        | 'vehicleArea'
                        | 'luggageStore'
                        | 'corridor'
                        | 'restaurant'
                        | 'toilet'
                        | 'bathroom'
                        | 'other'
                        | undefined;
                      passengerSpots:
                        | (
                            | {
                                IsByWindow: boolean | undefined;
                                IsByAisle: boolean | undefined;
                                IsBetweenSeats: boolean | undefined;
                                IsInFrontRow: boolean | undefined;
                                IsInEndRow: boolean | undefined;
                                TableType: string | undefined;
                                HasPower: boolean | undefined;
                                Centroid:
                                  | {
                                      x: number;
                                      y: number;
                                      toXML: () => {
                                        Location: {
                                          pos: string;
                                        };
                                      };
                                    }
                                  | undefined;
                                Width: number;
                                Length: number;
                                availability: undefined | import('../..').PassengerSpotAvailability;
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  Orientation:
                                    | {
                                        text_value:
                                          | 'backwards'
                                          | 'forwards'
                                          | 'leftwards'
                                          | 'rightwards';
                                      }
                                    | undefined;
                                  actualVehicleEquipments: any;
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  IsByWindow:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  IsByAisle:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  TableType:
                                    | {
                                        text_value: string;
                                      }
                                    | undefined;
                                  HasPower:
                                    | {
                                        text_value: true;
                                      }
                                    | undefined;
                                  Centroid:
                                    | {
                                        Location: {
                                          pos: string;
                                        };
                                      }
                                    | undefined;
                                  Width: number;
                                  Length: number;
                                };
                                getClasses: () => string;
                                getShape: (scale: number) =>
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      stroke: string;
                                      strokeWidth: number;
                                      cornerRadius: number;
                                      draggable: boolean;
                                    }
                                  | {
                                      x: number;
                                      y: number;
                                      width: number;
                                      height: number;
                                      fill: string;
                                      draggable: boolean;
                                      stroke?: undefined;
                                      strokeWidth?: undefined;
                                      cornerRadius?: undefined;
                                    };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      luggageSpots:
                        | (
                            | {
                                toXML: () => {
                                  attr_id: string;
                                  attr_version: string;
                                  Label: string | undefined;
                                  Orientation:
                                    | 'backwards'
                                    | 'forwards'
                                    | 'leftwards'
                                    | 'rightwards'
                                    | undefined;
                                  actualVehicleEquipments: {
                                    ActualVehicleEquipment: object[];
                                  };
                                  SpotColumnRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                  SpotRowRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                      }
                                    | undefined;
                                };
                                attr_id: string;
                                attr_version: string;
                                Label: string | undefined;
                                Orientation:
                                  | 'backwards'
                                  | 'forwards'
                                  | 'leftwards'
                                  | 'rightwards'
                                  | undefined;
                                actualVehicleEquipments: {
                                  Units: number;
                                  TicketingEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  TicketValidatorEquipmentRef:
                                    | {
                                        attr_ref: string;
                                        attr_version: string;
                                        toXML: () => {
                                          attr_ref: string;
                                          attr_version: string;
                                        };
                                      }
                                    | undefined;
                                  toXML: () => any;
                                  Fixed?: boolean | undefined;
                                  attr_id: string;
                                  attr_version: string;
                                  Name?: string | undefined;
                                  Description?: string | undefined;
                                }[];
                                SpotColumnRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                                SpotRowRef:
                                  | {
                                      attr_ref: string;
                                      attr_version: string;
                                      toXML: () => {
                                        attr_ref: string;
                                        attr_version: string;
                                      };
                                    }
                                  | undefined;
                              }
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                          )[]
                        | undefined;
                      deckEntrances:
                        | {
                            attr_id: string;
                            attr_version: string;
                            Name:
                              | {
                                  value: string;
                                  toXML: () => {
                                    text_value: string;
                                  };
                                }
                              | undefined;
                            Label: string | undefined;
                            Width: number | undefined;
                            Height: number | undefined;
                            actualVehicleEquipments: {
                              Units: number;
                              TicketingEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              TicketValidatorEquipmentRef:
                                | {
                                    attr_ref: string;
                                    attr_version: string;
                                    toXML: () => {
                                      attr_ref: string;
                                      attr_version: string;
                                    };
                                  }
                                | undefined;
                              toXML: () => any;
                              Fixed?: boolean | undefined;
                              attr_id: string;
                              attr_version: string;
                              Name?: string | undefined;
                              Description?: string | undefined;
                            }[];
                            PublicUse: boolean | undefined;
                            VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                            SequenceFromFront: number | undefined;
                            HeightFromGround: number | undefined;
                            DeckEntranceType: 'external' | 'internal' | undefined;
                            IsEmergencyExit: boolean | undefined;
                            HasDoor: boolean | undefined;
                            IsAutomatic: boolean | undefined;
                            Centroid:
                              | {
                                  x: number;
                                  y: number;
                                  toXML: () => {
                                    Location: {
                                      pos: string;
                                    };
                                  };
                                }
                              | undefined;
                            toXML: () => {
                              attr_id: string;
                              attr_version: string;
                              Name:
                                | {
                                    text_value: string;
                                  }
                                | undefined;
                              Label: string | undefined;
                              Width: number | undefined;
                              Height: number | undefined;
                              actualVehicleEquipments: {
                                ActualVehicleEquipment: object[];
                              };
                              PublicUse: boolean | undefined;
                              VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                              SequenceFromFront: number | undefined;
                              HeightFromGround: number | undefined;
                              DeckEntranceType: 'external' | 'internal' | undefined;
                              IsEmergencyExit: boolean | undefined;
                              HasDoor: boolean | undefined;
                              IsAutomatic: boolean | undefined;
                              Centroid:
                                | {
                                    Location: {
                                      pos: string;
                                    };
                                  }
                                | undefined;
                            };
                            getShape: (
                              scale: number,
                              deckLength: number,
                              deckWidth: number
                            ) => {
                              x: number;
                              y: number;
                              width: number;
                              height: number;
                              fill: string;
                              stroke: string;
                              strokeWidth: number;
                              draggable: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceUsage:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            validityConditions: (
                              | {
                                  attr_id: string;
                                  attr_version: string;
                                  Name: string;
                                  toXML: () => {
                                    attr_id: string;
                                    Name: string;
                                    attr_version: string;
                                  };
                                }
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                            )[];
                            Name: string;
                            EntranceUsageType: 'exit' | 'entrance' | undefined;
                            EntranceSetting: 'shut' | 'open' | undefined;
                            ControlledLocking: boolean;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              validityConditions: any;
                              Name: string;
                              EntranceUsageType: 'exit' | 'entrance' | undefined;
                              EntranceSetting: 'shut' | 'open' | undefined;
                              ControlledLocking: boolean;
                            };
                          }[]
                        | undefined;
                      deckEntranceCouples:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            FromDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            ToDeckEntranceRef: {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              FromDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                              ToDeckEntranceRef: {
                                attr_ref: string;
                                attr_version: string;
                              };
                            };
                          }[]
                        | undefined;
                      deckSpaceCapacities:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            LocatableSpotType: 'seat' | undefined;
                            capacity: number;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                              LocatableSpotType: 'seat' | undefined;
                              capacity: number;
                            };
                          }[]
                        | undefined;
                      actualVehicleEquipments:
                        | {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[]
                        | undefined;
                      ServiceFacilitySetRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      Centroid:
                        | {
                            x: number;
                            y: number;
                            toXML: () => {
                              Location: {
                                pos: string;
                              };
                            };
                          }
                        | undefined;
                      Polygon:
                        | {
                            value: object;
                            toXML: () => object;
                          }
                        | undefined;
                      PublicUse: boolean | undefined;
                      TotalCapacity: number | undefined;
                      FareClass: string | undefined;
                      AirConditioned: boolean | undefined;
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name: import('../..').Name | undefined;
                        SmokingAllowed: boolean | undefined;
                        StandingAllowed: boolean | undefined;
                        PassengerSpaceType:
                          | 'seatingArea'
                          | 'passengerCabin'
                          | 'vehicleArea'
                          | 'luggageStore'
                          | 'corridor'
                          | 'restaurant'
                          | 'toilet'
                          | 'bathroom'
                          | 'other'
                          | undefined;
                        passengerSpots: any;
                        luggageSpots: any;
                        deckEntrances: any;
                        deckEntranceUsage: any;
                        deckEntranceCouples: any;
                        deckSpaceCapacities: any;
                        actualVehicleEquipments: any;
                        ServiceFacilitySetRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                            }
                          | undefined;
                        Centroid:
                          | {
                              Location: {
                                pos: string;
                              };
                            }
                          | undefined;
                        Polygon: object | undefined;
                        PublicUse: boolean | undefined;
                        TotalCapacity: number | undefined;
                        FareClass: string | undefined;
                        AirConditioned: boolean | undefined;
                      };
                    }
                )[];
                DeckLevelRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                spotRows: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                spotColumns: {
                  attr_id: string;
                  label: string;
                  toXML: () => {
                    attr_id: string;
                    label: string;
                  };
                }[];
                Width: number;
                Length: number;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  spotRows: {
                    SpotRow: object[];
                  };
                  spotColumns: {
                    SpotColumn: object[];
                  };
                  deckSpaces: any;
                  DeckLevelRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                      }
                    | undefined;
                  polygon: object | undefined;
                  Name: string;
                  Width: number;
                  Length: number;
                };
                getBoundingBox: () => {
                  width: number;
                  height: number;
                };
                getShape: (scale: number) => {
                  x: number;
                  y: number;
                  width: number;
                  height: number;
                  fill: string;
                  stroke: string;
                  strokeWidth: number;
                  cornerRadius: number;
                };
              }[];
              addDeckLevel: () => void;
              removeDeckLevel: (deckLevelId: string) => void;
              toXML: () => {
                DeckPlan: {
                  xmlTagName: string;
                  attr_id: string;
                  attr_version: string;
                  decks: {
                    Deck: object[];
                  };
                  deckLevels: {
                    DeckLevel: object[];
                  };
                };
              };
            }
          | undefined;
        equipments: {
          Fixed?: boolean | undefined;
          toXML: () => any;
          attr_id: string;
          attr_version: string;
          Name?: string | undefined;
          Description?: string | undefined;
        }[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      } & import('pinia').PiniaCustomStateProperties<{
        deckplan: DeckPlan | undefined;
        equipments: PassengerEquipment[];
        wrapper: object | undefined;
        selectedDeckLevelId: string | undefined;
        selectedElementId: string | undefined;
        scale: number;
        activeTool: 'deckspace' | 'spot' | 'entrance' | undefined;
        activeEquipment: string | undefined;
        elementToBuild: any | undefined;
      }>
    ) =>
      | PassengerEntrance
      | LuggageSpot
      | PassengerSpot
      | {
          attr_id: string;
          attr_version: string;
          Name: string;
          polygon:
            | {
                value: object;
                toXML: () => object;
              }
            | undefined;
          deckspaces: (
            | {
                attr_id: string;
                attr_version: string;
                Name:
                  | {
                      value: string;
                      toXML: () => {
                        text_value: string;
                      };
                    }
                  | undefined;
                PublicUse: boolean | undefined;
                TotalCapacity: number | undefined;
                actualVehicleEquipments: {
                  Units: number;
                  TicketingEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  TicketValidatorEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  toXML: () => any;
                  Fixed?: boolean | undefined;
                  attr_id: string;
                  attr_version: string;
                  Name?: string | undefined;
                  Description?: string | undefined;
                }[];
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Name:
                    | (() => {
                        text_value: string;
                      })
                    | undefined;
                };
              }
            | {
                attr_id: string;
                attr_version: string;
                Name:
                  | {
                      value: string;
                      toXML: () => {
                        text_value: string;
                      };
                    }
                  | undefined;
                SmokingAllowed: boolean | undefined;
                StandingAllowed: boolean | undefined;
                PassengerSpaceType:
                  | 'seatingArea'
                  | 'passengerCabin'
                  | 'vehicleArea'
                  | 'luggageStore'
                  | 'corridor'
                  | 'restaurant'
                  | 'toilet'
                  | 'bathroom'
                  | 'other'
                  | undefined;
                passengerSpots:
                  | (
                      | {
                          IsByWindow: boolean | undefined;
                          IsByAisle: boolean | undefined;
                          IsBetweenSeats: boolean | undefined;
                          IsInFrontRow: boolean | undefined;
                          IsInEndRow: boolean | undefined;
                          TableType: string | undefined;
                          HasPower: boolean | undefined;
                          Centroid:
                            | {
                                x: number;
                                y: number;
                                toXML: () => {
                                  Location: {
                                    pos: string;
                                  };
                                };
                              }
                            | undefined;
                          Width: number;
                          Length: number;
                          availability: undefined | import('../..').PassengerSpotAvailability;
                          toXML: () => {
                            attr_id: string;
                            attr_version: string;
                            Label:
                              | {
                                  text_value: string;
                                }
                              | undefined;
                            Orientation:
                              | {
                                  text_value: 'backwards' | 'forwards' | 'leftwards' | 'rightwards';
                                }
                              | undefined;
                            actualVehicleEquipments: any;
                            SpotColumnRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            SpotRowRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            IsByWindow:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            IsByAisle:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            TableType:
                              | {
                                  text_value: string;
                                }
                              | undefined;
                            HasPower:
                              | {
                                  text_value: true;
                                }
                              | undefined;
                            Centroid:
                              | {
                                  Location: {
                                    pos: string;
                                  };
                                }
                              | undefined;
                            Width: number;
                            Length: number;
                          };
                          getClasses: () => string;
                          getShape: (scale: number) =>
                            | {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                                fill: string;
                                stroke: string;
                                strokeWidth: number;
                                cornerRadius: number;
                                draggable: boolean;
                              }
                            | {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                                fill: string;
                                draggable: boolean;
                                stroke?: undefined;
                                strokeWidth?: undefined;
                                cornerRadius?: undefined;
                              };
                          attr_id: string;
                          attr_version: string;
                          Label: string | undefined;
                          Orientation:
                            | 'backwards'
                            | 'forwards'
                            | 'leftwards'
                            | 'rightwards'
                            | undefined;
                          actualVehicleEquipments: {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[];
                          SpotColumnRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                          SpotRowRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                        }
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                    )[]
                  | undefined;
                luggageSpots:
                  | (
                      | {
                          toXML: () => {
                            attr_id: string;
                            attr_version: string;
                            Label: string | undefined;
                            Orientation:
                              | 'backwards'
                              | 'forwards'
                              | 'leftwards'
                              | 'rightwards'
                              | undefined;
                            actualVehicleEquipments: {
                              ActualVehicleEquipment: object[];
                            };
                            SpotColumnRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                            SpotRowRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                }
                              | undefined;
                          };
                          attr_id: string;
                          attr_version: string;
                          Label: string | undefined;
                          Orientation:
                            | 'backwards'
                            | 'forwards'
                            | 'leftwards'
                            | 'rightwards'
                            | undefined;
                          actualVehicleEquipments: {
                            Units: number;
                            TicketingEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            TicketValidatorEquipmentRef:
                              | {
                                  attr_ref: string;
                                  attr_version: string;
                                  toXML: () => {
                                    attr_ref: string;
                                    attr_version: string;
                                  };
                                }
                              | undefined;
                            toXML: () => any;
                            Fixed?: boolean | undefined;
                            attr_id: string;
                            attr_version: string;
                            Name?: string | undefined;
                            Description?: string | undefined;
                          }[];
                          SpotColumnRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                          SpotRowRef:
                            | {
                                attr_ref: string;
                                attr_version: string;
                                toXML: () => {
                                  attr_ref: string;
                                  attr_version: string;
                                };
                              }
                            | undefined;
                        }
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                    )[]
                  | undefined;
                deckEntrances:
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name:
                        | {
                            value: string;
                            toXML: () => {
                              text_value: string;
                            };
                          }
                        | undefined;
                      Label: string | undefined;
                      Width: number | undefined;
                      Height: number | undefined;
                      actualVehicleEquipments: {
                        Units: number;
                        TicketingEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        TicketValidatorEquipmentRef:
                          | {
                              attr_ref: string;
                              attr_version: string;
                              toXML: () => {
                                attr_ref: string;
                                attr_version: string;
                              };
                            }
                          | undefined;
                        toXML: () => any;
                        Fixed?: boolean | undefined;
                        attr_id: string;
                        attr_version: string;
                        Name?: string | undefined;
                        Description?: string | undefined;
                      }[];
                      PublicUse: boolean | undefined;
                      VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                      SequenceFromFront: number | undefined;
                      HeightFromGround: number | undefined;
                      DeckEntranceType: 'external' | 'internal' | undefined;
                      IsEmergencyExit: boolean | undefined;
                      HasDoor: boolean | undefined;
                      IsAutomatic: boolean | undefined;
                      Centroid:
                        | {
                            x: number;
                            y: number;
                            toXML: () => {
                              Location: {
                                pos: string;
                              };
                            };
                          }
                        | undefined;
                      toXML: () => {
                        attr_id: string;
                        attr_version: string;
                        Name:
                          | {
                              text_value: string;
                            }
                          | undefined;
                        Label: string | undefined;
                        Width: number | undefined;
                        Height: number | undefined;
                        actualVehicleEquipments: {
                          ActualVehicleEquipment: object[];
                        };
                        PublicUse: boolean | undefined;
                        VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                        SequenceFromFront: number | undefined;
                        HeightFromGround: number | undefined;
                        DeckEntranceType: 'external' | 'internal' | undefined;
                        IsEmergencyExit: boolean | undefined;
                        HasDoor: boolean | undefined;
                        IsAutomatic: boolean | undefined;
                        Centroid:
                          | {
                              Location: {
                                pos: string;
                              };
                            }
                          | undefined;
                      };
                      getShape: (
                        scale: number,
                        deckLength: number,
                        deckWidth: number
                      ) => {
                        x: number;
                        y: number;
                        width: number;
                        height: number;
                        fill: string;
                        stroke: string;
                        strokeWidth: number;
                        draggable: boolean;
                      };
                    }[]
                  | undefined;
                deckEntranceUsage:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      validityConditions: (
                        | {
                            attr_id: string;
                            attr_version: string;
                            Name: string;
                            toXML: () => {
                              attr_id: string;
                              Name: string;
                              attr_version: string;
                            };
                          }
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                      )[];
                      Name: string;
                      EntranceUsageType: 'exit' | 'entrance' | undefined;
                      EntranceSetting: 'shut' | 'open' | undefined;
                      ControlledLocking: boolean;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        validityConditions: any;
                        Name: string;
                        EntranceUsageType: 'exit' | 'entrance' | undefined;
                        EntranceSetting: 'shut' | 'open' | undefined;
                        ControlledLocking: boolean;
                      };
                    }[]
                  | undefined;
                deckEntranceCouples:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      FromDeckEntranceRef: {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                      ToDeckEntranceRef: {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        FromDeckEntranceRef: {
                          attr_ref: string;
                          attr_version: string;
                        };
                        ToDeckEntranceRef: {
                          attr_ref: string;
                          attr_version: string;
                        };
                      };
                    }[]
                  | undefined;
                deckSpaceCapacities:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      LocatableSpotType: 'seat' | undefined;
                      capacity: number;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                        LocatableSpotType: 'seat' | undefined;
                        capacity: number;
                      };
                    }[]
                  | undefined;
                actualVehicleEquipments:
                  | {
                      Units: number;
                      TicketingEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      TicketValidatorEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      toXML: () => any;
                      Fixed?: boolean | undefined;
                      attr_id: string;
                      attr_version: string;
                      Name?: string | undefined;
                      Description?: string | undefined;
                    }[]
                  | undefined;
                ServiceFacilitySetRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                Centroid:
                  | {
                      x: number;
                      y: number;
                      toXML: () => {
                        Location: {
                          pos: string;
                        };
                      };
                    }
                  | undefined;
                Polygon:
                  | {
                      value: object;
                      toXML: () => object;
                    }
                  | undefined;
                PublicUse: boolean | undefined;
                TotalCapacity: number | undefined;
                FareClass: string | undefined;
                AirConditioned: boolean | undefined;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Name: import('../..').Name | undefined;
                  SmokingAllowed: boolean | undefined;
                  StandingAllowed: boolean | undefined;
                  PassengerSpaceType:
                    | 'seatingArea'
                    | 'passengerCabin'
                    | 'vehicleArea'
                    | 'luggageStore'
                    | 'corridor'
                    | 'restaurant'
                    | 'toilet'
                    | 'bathroom'
                    | 'other'
                    | undefined;
                  passengerSpots: any;
                  luggageSpots: any;
                  deckEntrances: any;
                  deckEntranceUsage: any;
                  deckEntranceCouples: any;
                  deckSpaceCapacities: any;
                  actualVehicleEquipments: any;
                  ServiceFacilitySetRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                      }
                    | undefined;
                  Centroid:
                    | {
                        Location: {
                          pos: string;
                        };
                      }
                    | undefined;
                  Polygon: object | undefined;
                  PublicUse: boolean | undefined;
                  TotalCapacity: number | undefined;
                  FareClass: string | undefined;
                  AirConditioned: boolean | undefined;
                };
              }
          )[];
          DeckLevelRef:
            | {
                attr_ref: string;
                attr_version: string;
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                };
              }
            | undefined;
          spotRows: {
            attr_id: string;
            label: string;
            toXML: () => {
              attr_id: string;
              label: string;
            };
          }[];
          spotColumns: {
            attr_id: string;
            label: string;
            toXML: () => {
              attr_id: string;
              label: string;
            };
          }[];
          Width: number;
          Length: number;
          toXML: () => {
            attr_id: string;
            attr_version: string;
            spotRows: {
              SpotRow: object[];
            };
            spotColumns: {
              SpotColumn: object[];
            };
            deckSpaces: any;
            DeckLevelRef:
              | {
                  attr_ref: string;
                  attr_version: string;
                }
              | undefined;
            polygon: object | undefined;
            Name: string;
            Width: number;
            Length: number;
          };
          getBoundingBox: () => {
            width: number;
            height: number;
          };
          getShape: (scale: number) => {
            x: number;
            y: number;
            width: number;
            height: number;
            fill: string;
            stroke: string;
            strokeWidth: number;
            cornerRadius: number;
          };
        }
      | {
          attr_id: string;
          attr_version: string;
          Name:
            | {
                value: string;
                toXML: () => {
                  text_value: string;
                };
              }
            | undefined;
          PublicUse: boolean | undefined;
          TotalCapacity: number | undefined;
          actualVehicleEquipments: {
            Units: number;
            TicketingEquipmentRef:
              | {
                  attr_ref: string;
                  attr_version: string;
                  toXML: () => {
                    attr_ref: string;
                    attr_version: string;
                  };
                }
              | undefined;
            TicketValidatorEquipmentRef:
              | {
                  attr_ref: string;
                  attr_version: string;
                  toXML: () => {
                    attr_ref: string;
                    attr_version: string;
                  };
                }
              | undefined;
            toXML: () => any;
            Fixed?: boolean | undefined;
            attr_id: string;
            attr_version: string;
            Name?: string | undefined;
            Description?: string | undefined;
          }[];
          toXML: () => {
            attr_id: string;
            attr_version: string;
            Name:
              | (() => {
                  text_value: string;
                })
              | undefined;
          };
        }
      | {
          attr_id: string;
          attr_version: string;
          Name:
            | {
                value: string;
                toXML: () => {
                  text_value: string;
                };
              }
            | undefined;
          SmokingAllowed: boolean | undefined;
          StandingAllowed: boolean | undefined;
          PassengerSpaceType:
            | 'seatingArea'
            | 'passengerCabin'
            | 'vehicleArea'
            | 'luggageStore'
            | 'corridor'
            | 'restaurant'
            | 'toilet'
            | 'bathroom'
            | 'other'
            | undefined;
          passengerSpots:
            | (
                | {
                    IsByWindow: boolean | undefined;
                    IsByAisle: boolean | undefined;
                    IsBetweenSeats: boolean | undefined;
                    IsInFrontRow: boolean | undefined;
                    IsInEndRow: boolean | undefined;
                    TableType: string | undefined;
                    HasPower: boolean | undefined;
                    Centroid:
                      | {
                          x: number;
                          y: number;
                          toXML: () => {
                            Location: {
                              pos: string;
                            };
                          };
                        }
                      | undefined;
                    Width: number;
                    Length: number;
                    availability: undefined | import('../..').PassengerSpotAvailability;
                    toXML: () => {
                      attr_id: string;
                      attr_version: string;
                      Label:
                        | {
                            text_value: string;
                          }
                        | undefined;
                      Orientation:
                        | {
                            text_value: 'backwards' | 'forwards' | 'leftwards' | 'rightwards';
                          }
                        | undefined;
                      actualVehicleEquipments: any;
                      SpotColumnRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                          }
                        | undefined;
                      SpotRowRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                          }
                        | undefined;
                      IsByWindow:
                        | {
                            text_value: true;
                          }
                        | undefined;
                      IsByAisle:
                        | {
                            text_value: true;
                          }
                        | undefined;
                      TableType:
                        | {
                            text_value: string;
                          }
                        | undefined;
                      HasPower:
                        | {
                            text_value: true;
                          }
                        | undefined;
                      Centroid:
                        | {
                            Location: {
                              pos: string;
                            };
                          }
                        | undefined;
                      Width: number;
                      Length: number;
                    };
                    getClasses: () => string;
                    getShape: (scale: number) =>
                      | {
                          x: number;
                          y: number;
                          width: number;
                          height: number;
                          fill: string;
                          stroke: string;
                          strokeWidth: number;
                          cornerRadius: number;
                          draggable: boolean;
                        }
                      | {
                          x: number;
                          y: number;
                          width: number;
                          height: number;
                          fill: string;
                          draggable: boolean;
                          stroke?: undefined;
                          strokeWidth?: undefined;
                          cornerRadius?: undefined;
                        };
                    attr_id: string;
                    attr_version: string;
                    Label: string | undefined;
                    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined;
                    actualVehicleEquipments: {
                      Units: number;
                      TicketingEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      TicketValidatorEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      toXML: () => any;
                      Fixed?: boolean | undefined;
                      attr_id: string;
                      attr_version: string;
                      Name?: string | undefined;
                      Description?: string | undefined;
                    }[];
                    SpotColumnRef:
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                      | undefined;
                    SpotRowRef:
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                      | undefined;
                  }
                | {
                    attr_ref: string;
                    attr_version: string;
                    toXML: () => {
                      attr_ref: string;
                      attr_version: string;
                    };
                  }
              )[]
            | undefined;
          luggageSpots:
            | (
                | {
                    toXML: () => {
                      attr_id: string;
                      attr_version: string;
                      Label: string | undefined;
                      Orientation:
                        | 'backwards'
                        | 'forwards'
                        | 'leftwards'
                        | 'rightwards'
                        | undefined;
                      actualVehicleEquipments: {
                        ActualVehicleEquipment: object[];
                      };
                      SpotColumnRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                          }
                        | undefined;
                      SpotRowRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                          }
                        | undefined;
                    };
                    attr_id: string;
                    attr_version: string;
                    Label: string | undefined;
                    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined;
                    actualVehicleEquipments: {
                      Units: number;
                      TicketingEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      TicketValidatorEquipmentRef:
                        | {
                            attr_ref: string;
                            attr_version: string;
                            toXML: () => {
                              attr_ref: string;
                              attr_version: string;
                            };
                          }
                        | undefined;
                      toXML: () => any;
                      Fixed?: boolean | undefined;
                      attr_id: string;
                      attr_version: string;
                      Name?: string | undefined;
                      Description?: string | undefined;
                    }[];
                    SpotColumnRef:
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                      | undefined;
                    SpotRowRef:
                      | {
                          attr_ref: string;
                          attr_version: string;
                          toXML: () => {
                            attr_ref: string;
                            attr_version: string;
                          };
                        }
                      | undefined;
                  }
                | {
                    attr_ref: string;
                    attr_version: string;
                    toXML: () => {
                      attr_ref: string;
                      attr_version: string;
                    };
                  }
              )[]
            | undefined;
          deckEntrances:
            | {
                attr_id: string;
                attr_version: string;
                Name:
                  | {
                      value: string;
                      toXML: () => {
                        text_value: string;
                      };
                    }
                  | undefined;
                Label: string | undefined;
                Width: number | undefined;
                Height: number | undefined;
                actualVehicleEquipments: {
                  Units: number;
                  TicketingEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  TicketValidatorEquipmentRef:
                    | {
                        attr_ref: string;
                        attr_version: string;
                        toXML: () => {
                          attr_ref: string;
                          attr_version: string;
                        };
                      }
                    | undefined;
                  toXML: () => any;
                  Fixed?: boolean | undefined;
                  attr_id: string;
                  attr_version: string;
                  Name?: string | undefined;
                  Description?: string | undefined;
                }[];
                PublicUse: boolean | undefined;
                VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                SequenceFromFront: number | undefined;
                HeightFromGround: number | undefined;
                DeckEntranceType: 'external' | 'internal' | undefined;
                IsEmergencyExit: boolean | undefined;
                HasDoor: boolean | undefined;
                IsAutomatic: boolean | undefined;
                Centroid:
                  | {
                      x: number;
                      y: number;
                      toXML: () => {
                        Location: {
                          pos: string;
                        };
                      };
                    }
                  | undefined;
                toXML: () => {
                  attr_id: string;
                  attr_version: string;
                  Name:
                    | {
                        text_value: string;
                      }
                    | undefined;
                  Label: string | undefined;
                  Width: number | undefined;
                  Height: number | undefined;
                  actualVehicleEquipments: {
                    ActualVehicleEquipment: object[];
                  };
                  PublicUse: boolean | undefined;
                  VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
                  SequenceFromFront: number | undefined;
                  HeightFromGround: number | undefined;
                  DeckEntranceType: 'external' | 'internal' | undefined;
                  IsEmergencyExit: boolean | undefined;
                  HasDoor: boolean | undefined;
                  IsAutomatic: boolean | undefined;
                  Centroid:
                    | {
                        Location: {
                          pos: string;
                        };
                      }
                    | undefined;
                };
                getShape: (
                  scale: number,
                  deckLength: number,
                  deckWidth: number
                ) => {
                  x: number;
                  y: number;
                  width: number;
                  height: number;
                  fill: string;
                  stroke: string;
                  strokeWidth: number;
                  draggable: boolean;
                };
              }[]
            | undefined;
          deckEntranceUsage:
            | {
                attr_ref: string;
                attr_version: string;
                validityConditions: (
                  | {
                      attr_id: string;
                      attr_version: string;
                      Name: string;
                      toXML: () => {
                        attr_id: string;
                        Name: string;
                        attr_version: string;
                      };
                    }
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                )[];
                Name: string;
                EntranceUsageType: 'exit' | 'entrance' | undefined;
                EntranceSetting: 'shut' | 'open' | undefined;
                ControlledLocking: boolean;
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                  validityConditions: any;
                  Name: string;
                  EntranceUsageType: 'exit' | 'entrance' | undefined;
                  EntranceSetting: 'shut' | 'open' | undefined;
                  ControlledLocking: boolean;
                };
              }[]
            | undefined;
          deckEntranceCouples:
            | {
                attr_ref: string;
                attr_version: string;
                FromDeckEntranceRef: {
                  attr_ref: string;
                  attr_version: string;
                  toXML: () => {
                    attr_ref: string;
                    attr_version: string;
                  };
                };
                ToDeckEntranceRef: {
                  attr_ref: string;
                  attr_version: string;
                  toXML: () => {
                    attr_ref: string;
                    attr_version: string;
                  };
                };
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                  FromDeckEntranceRef: {
                    attr_ref: string;
                    attr_version: string;
                  };
                  ToDeckEntranceRef: {
                    attr_ref: string;
                    attr_version: string;
                  };
                };
              }[]
            | undefined;
          deckSpaceCapacities:
            | {
                attr_ref: string;
                attr_version: string;
                LocatableSpotType: 'seat' | undefined;
                capacity: number;
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                  LocatableSpotType: 'seat' | undefined;
                  capacity: number;
                };
              }[]
            | undefined;
          actualVehicleEquipments:
            | {
                Units: number;
                TicketingEquipmentRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                TicketValidatorEquipmentRef:
                  | {
                      attr_ref: string;
                      attr_version: string;
                      toXML: () => {
                        attr_ref: string;
                        attr_version: string;
                      };
                    }
                  | undefined;
                toXML: () => any;
                Fixed?: boolean | undefined;
                attr_id: string;
                attr_version: string;
                Name?: string | undefined;
                Description?: string | undefined;
              }[]
            | undefined;
          ServiceFacilitySetRef:
            | {
                attr_ref: string;
                attr_version: string;
                toXML: () => {
                  attr_ref: string;
                  attr_version: string;
                };
              }
            | undefined;
          Centroid:
            | {
                x: number;
                y: number;
                toXML: () => {
                  Location: {
                    pos: string;
                  };
                };
              }
            | undefined;
          Polygon:
            | {
                value: object;
                toXML: () => object;
              }
            | undefined;
          PublicUse: boolean | undefined;
          TotalCapacity: number | undefined;
          FareClass: string | undefined;
          AirConditioned: boolean | undefined;
          toXML: () => {
            attr_id: string;
            attr_version: string;
            Name: import('../..').Name | undefined;
            SmokingAllowed: boolean | undefined;
            StandingAllowed: boolean | undefined;
            PassengerSpaceType:
              | 'seatingArea'
              | 'passengerCabin'
              | 'vehicleArea'
              | 'luggageStore'
              | 'corridor'
              | 'restaurant'
              | 'toilet'
              | 'bathroom'
              | 'other'
              | undefined;
            passengerSpots: any;
            luggageSpots: any;
            deckEntrances: any;
            deckEntranceUsage: any;
            deckEntranceCouples: any;
            deckSpaceCapacities: any;
            actualVehicleEquipments: any;
            ServiceFacilitySetRef:
              | {
                  attr_ref: string;
                  attr_version: string;
                }
              | undefined;
            Centroid:
              | {
                  Location: {
                    pos: string;
                  };
                }
              | undefined;
            Polygon: object | undefined;
            PublicUse: boolean | undefined;
            TotalCapacity: number | undefined;
            FareClass: string | undefined;
            AirConditioned: boolean | undefined;
          };
        }
      | undefined;
  },
  {
    updateElement(elementId: string, updates: any): void;
    setActiveTool(tool: 'deckspace' | 'spot' | 'entrance' | undefined, equipment?: string): void;
    setDeckplan([deckplan, wrapper]: [DeckPlan, object | undefined]): void;
    setEquipments(equipments: PassengerEquipment[]): void;
    addEquipment(equipment: PassengerEquipment): void;
    updateEquipment(equipmentId: string, updates: Partial<PassengerEquipment>): void;
    deleteEquipment(equipmentId: string): void;
    addDeckLevel(): void;
    removeDeckLevel(): void;
    selectDeckLevel(deckLevelId: string): void;
    selectElement(elementId: string | undefined): void;
    selectElementToBuild(element: any): void;
    updateElementToBuild(updates: any): void;
    moveElement(sourceId: string, targetId: string, position?: 'before' | 'inside' | 'after'): void;
    addElementToParent(element: BuildableElement, targetId: string, insertIndex?: number): void;
    addElementToDeck(element: BuildableElement, targetId: string): void;
    deleteElement(elementId: string): void;
  }
>;
