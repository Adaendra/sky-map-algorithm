import {HorizontalCoordinates} from "../coordinates/HorizontalCoordinates";

export class StarData {

  // ATTRIBUTES
  /**
   * Id of the star.
   * @type string
   */
  public key: string;
  /**
   * Name of the star.
   * @type string
   */
  public starName: string;
  /**
   * Name of the constellation which the star is in.
   * @type string
   */
  public constellationName: string;
  /**
   * Right Ascension Hour
   * @type string
   */
  public raH: string;
  /**
   * Right Ascension Minute
   * @type string
   */
  public raM: string;
  /**
   * Right Ascension Second
   * @type string
   */
  public raS: string;
  /**
   * Declination Degree
   * @type string
   */
  public decD: string;
  /**
   * Declination Minute
   * @type string
   */
  public decM: string;
  /**
   * Declination Seconds
   * @type string
   */
  public decS: string;
  /**
   * Star's magnitude
   * @type string
   */
  public magnitude: string;
  /**
   * Star's horizontal coordinates
   * @type HorizontalCoordinates
   */
  public horizontalCoordinates: HorizontalCoordinates;

  // CONSTRUCTOR
  constructor() {}

}
