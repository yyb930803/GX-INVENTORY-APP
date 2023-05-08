import SoundPlayer from 'react-native-sound';

class Sound {
    constructor() {
        this.sounds = {
            0: 'zero.mp3',
            1: 'one.mp3',
            2: 'two.mp3',
            3: 'three.mp3',
            4: 'four.mp3',
            5: 'five.mp3',
            6: 'six.mp3',
            7: 'seven.mp3',
            8: 'eight.mp3',
            9: 'nine.mp3',
            alert: 'error.mp3',
        };

        this.audioPlayer = {};
        this.loadSounds();
    }

    loadSounds = () => {
        Object.keys(this.sounds).forEach((key) => {
            const sound = new SoundPlayer(this.sounds[key], SoundPlayer.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.warn(`Failed to load sound '${key}':`, error);
                }
            });
            this.audioPlayer[key] = sound;
        });
    };

    playSound = (key) => {
        if (key in this.audioPlayer) {
            this.audioPlayer[key].play();
        }
    };
}

const SoundObject = new Sound();
export default SoundObject;
