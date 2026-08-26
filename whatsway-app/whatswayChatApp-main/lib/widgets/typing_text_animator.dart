import 'dart:async';
import 'package:flutter/material.dart';

class TypingTextAnimator extends StatefulWidget {
  final List<String> texts;
  final TextStyle? style;
  final Duration speed;
  final TextAlign? textAlign;
  final bool loop;
  final Duration pauseDuration;

  const TypingTextAnimator({
    super.key,
    required this.texts,
    this.style,
    this.speed = const Duration(milliseconds: 100),
    this.textAlign,
    this.loop = true,
    this.pauseDuration = const Duration(seconds: 2),
  });

  @override
  State<TypingTextAnimator> createState() => _TypingTextAnimatorState();
}

class _TypingTextAnimatorState extends State<TypingTextAnimator> {
  String _displayedText = '';
  Timer? _timer;
  Timer? _pauseTimer;
  int _currentTextIndex = 0;
  int _currentCharIndex = 0;

  @override
  void initState() {
    super.initState();
    if (widget.texts.isNotEmpty) {
      _startTyping();
    }
  }

  void _startTyping() {
    if (widget.texts.isEmpty) return;
    
    String currentText = widget.texts[_currentTextIndex];

    _timer = Timer.periodic(widget.speed, (timer) {
      if (_currentCharIndex < currentText.length) {
        setState(() {
          _displayedText += currentText[_currentCharIndex];
          _currentCharIndex++;
        });
      } else {
        _timer?.cancel();
        
        _pauseTimer = Timer(widget.pauseDuration, () {
          if (mounted) {
            setState(() {
              _displayedText = '';
              _currentCharIndex = 0;
              
              _currentTextIndex++;
              if (_currentTextIndex >= widget.texts.length) {
                if (widget.loop) {
                  _currentTextIndex = 0;
                } else {
                  return; // Stop animation if not looping
                }
              }
            });
            _startTyping();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pauseTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(
      _displayedText,
      style: widget.style,
      textAlign: widget.textAlign,
    );
  }
}
