export const DATASETS = [
    {
        "id": 'assessment',
        "name": "Assessment",
        "cartoAccount": "wprdc-editor",
        "cartoTable": "wprdc.assessments",
        "mapId": "4156fe54-fddc-43e6-993a-6ad37626e9e0",
        "cartoCssId": "#assessments",
        "parcelIdField": 'parid',
        "fields": [
            {
                "id": "fairmarkettotal",
                "name": "Total Assessed Value (Fair Market)",
                "info": "",
                "type": "numeric",
                "subtype": "money",
                "range": [null, null],
                "valueFunction": "pow",
                "base": ".0001"
            },
            {
                "id": "fairmarketland",
                "name": "Assessed Land Value (Fair Market)",
                "info": "",
                "type": "numeric",
                "subtype": "money",
                "range": [null, null],
                "valueFunction": "pow",
                "base": "0.0001"
            },
            {
                "id": "fairmarketbuilding",
                "name": "Assessed Building Value (Fair Market)",
                "info": "",
                "type": "numeric",
                "subtype": "money",
                "range": [null, null],
                "valueFunction": "pow",
                "base": "0.1"
            },
            {
                "id": "yearblt",
                "name": "Year Built",
                "info": "some info and stuff2",
                "type": "numeric",
                "range": [1755, 2017]
            },
            {
                "id": "yearsold",
                "name": "Year of Last Sale",
                "info": "some info and stuff2",
                "type": "numeric",
                "range": [1794, 2017]
            },
            {
                "id": "classdesc",
                "name": "Land Use Class",
                "info": "some info and stuff2",
                "type": "category"
            },
            {
                "id": "usedesc",
                "name": "Land Use Description",
                "info": "some info and stuff2",
                "type": "category"
            }
        ]
    },
    {
        "id": 'liens',
        "name": "Liens",
        "cartoAccount": "wprdc-editor",
        "cartoTable": "allegheny_county_tax_liens",
        "mapId": "2ac98314-c5b9-4730-ae79-71c80dbd8790",
        "cartoCssId": "#liens",
        "parcelIdField": "#allegheny_county_tax_liens",
        "fields": [
            {
                "id": "total_amount",
                "name": "Total Amount of Liens ($)",
                "info": "some info and stuff",
                "type": "money",
                "range": [null, null],
                "valueFunction": "log",
                "base": "20"
            },
            {
                "id": "number",
                "name": "Number of Liens",
                "info": "some info and stuff2",
                "type": "numeric",
                "range": [null, null]
            }
        ]
    }
];




export class MapDataSource{
    /**
     * Connects to Carto maps' data (currently hardcoded MAP_DATA)
     * @param data - initial set of data
     */
    constructor(data){
        this.datasets = data
    }


    /**
     * Get first dataset that matches datasetId.
     * TODO: assert unique ids at onset to prevent this ambiguous 'first' crap.
     * @param {string} datasetId - identifier of dataset (e.g. 'assessments')
     * @return {{}} dataset
     */
    getDataset(datasetId){
        return this.datasets.filter((dataset) => dataset.id === datasetId)[0]
    }

    /**
     * Get field identified by `fieldId` from dataset identified by `datasetId`
     * @param {string} datasetId - identifier of dataset (e.g. 'assessments')
     * @param {string} fieldId - identifier of field (e.g. 'price')
     * @return {{}} field object identified by `fieldId`
     */
    getField(datasetId, fieldId){
        return this.getDataset(datasetId).fields.filter((field)=> field.id === fieldId)[0]
    }

    /**
     * Returns all datasets
     * @return {[{}]} all datasets
     */
    getDatasets(){
        return this.datasets;
    }

    /**
     * Returns all fields in dataset, if type is provided, this will return all fields filtered by that type
     * @param {string} datasetId - identifier of dataset (e.g. 'assessments')
     * @param {string} type - type of data the field is (e.g. numeric ,category)
     * @return {[]} array of field objects from dataset
     */
    getFields(datasetId, type){
        if(type){
            return this.getDatasets(datasetId).fields.filter((field) => field.type === type)
        }
        return this.getDataset(datasetId).fields;
    }

    /**
     * Checks whether dataset identified by `datasetId` accommodates a style type labeled `type`
     * (i.e. any of its fields have type === `type`)
     * @param {string} datasetId - identifier of dataset (e.g. 'assessments')
     * @param {string} type - name of style type
     * @return {boolean} True if the dataset does accommodate the `type`
     */
    accommodatesType(datasetId, type){
        for(let field of this.getFields(datasetId)){
            if(field.type === type){
                return true
            }
        }
        return false
    }


}

let mapDataSource = new MapDataSource(DATASETS);
export default mapDataSource;