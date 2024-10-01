import Plugin from '../../../plugins';

export default class RPoints extends Plugin {
    static depends: string[] = ["game:TmForever"];
    
    async onLoad() {
        tmc.addCommand("//rpoints", this.cmdChat.bind(this), "Set custom round points");        
    }

    async onUnload() {           
        tmc.removeCommand("//rpoints");
    }

    async cmdChat(login: string, params: string[]) {
        let points: Array<number> = [];
        let str: string[] = [];
        if (params.length > 0) {
            let str_array = params[0].split(',');
            for (let i = 0; i < str_array.length; i++) {
                // Trim the excess whitespace.
                str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
                
                let number = parseInt(str_array[i]);
                if (isNaN(number)) {
                    tmc.chat(`¤white¤"${str_array[i]}"¤info¤ is not a number`, login);
                    return;
                }
                
                if (number > 255) {
                    tmc.chat("¤info¤Scores must be <= 255", login);
                    return;
                }
                
                if (i == 0 && number < 1) {
                    tmc.chat("¤info¤The winner score must be > 0", login);
                    return;
                }
                
                if (i > 0) {
                    if (number < 0) {
                        tmc.chat("¤info¤The non-winner scores must be >= 0", login);
                        return;
                    }
                    if (number > points[i-1]) {
                        tmc.chat("¤info¤Subsequent points can't be larger than the previous - must be equal or decreasing", login);
                        return;
                    }
                }
                
                str += str_array[i];
                if (i < str_array.length - 1) {
                    str += ",";
                }
                points.push(number);
            }
            
            if (str_array.length < 2) {
                tmc.chat("¤info¤Not enough points in array - at least two are required", login);
                return;
            }
            
            tmc.server.call("SetRoundCustomPoints", points);
            tmc.chat(`¤info¤Set new custom points to: ¤white¤${str}`, login);
        }
        else {
            points = tmc.server.call("GetRoundCustomPoints", points);
            
            for (let i = 0; i < points.length; i++) {
                str += points[i];
                if (i < points.length - 1) {
                    str += ",";
                }
            }
            
            tmc.chat(`¤info¤Current points are: ¤white¤${str}`, login);
        }
    }
}