export default class KeepData{
    public static __data__ = {};
    public static get(domain : string){
        if(KeepData.__data__[domain]){
            return KeepData.__data__[domain];
        }
    }

    public static set(domain : string, value){
        KeepData.__data__[domain] = value;
    }
}